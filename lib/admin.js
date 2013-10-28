var storage = require('./storage');
var _ = require('lodash');

var bot;

/**
 * Admin module must be executed to pass the 'bot' parameter
 * @param bot {object} IRC Bot object
 */
var admin = function(_bot_){
  bot = _bot_;
  function getChannel(name, from) {
    if (!storage.channels[name]) {
      bot.say(from, 'Channel "'+name+'" isn\'t registered.');
    } else {
      return storage.channels[name];
    }
  }
  function formatName(name) {
    if (name[0] !== '#')
      name = '#'+name;
    return name;
  }
  function error(to, message, error) {
    bot.say(to, message + ': ' + err);
    console.log(message, 'User: ' + to, err);
  }

  /**
   * Administrative patterns
   */
  return {
    '^register (\\S+)': function(from, matches) {
      var name = formatName(matches[1]);
      if (storage.channels[matches[1]]) {
        return bot.say(from, 'Channel "'+name+'" already registered.');
      }

      bot.join(name, function(){
        var channel = new storage.model({
          name: name
        });
        channel.save(function(err, channel){
          if (err) {
            error(from, 'Error registering "'+name+'"', err);
          } else {
            storage.channels[name] = channel;
            admin.load(channel);
            bot.say(from, 'Channel "'+name+'" registered!');
          }
        });
      });
    },
    '^unregister (\\S+)': function(from, matches) {
      var name = formatName(matches[1]);
      var channel;
      if (!getChannel(name, from)) return;
      bot.part(name);
      delete storage.channels[name];
      channel.remove(function(err, channel){
        if (err) {
          error(from, 'Error removing "'+name+'"', err);
        } else {
          bot.say(from, 'Channel "'+name+'"  unregistered!');
        }
      });
    },
    '^plugin (\\S+) (\\S+)': function(from, matches) {
      var name = formatName(matches[1]);
      var channel;
      if (!(channel = getChannel(name, from))) return;
      var found = channel.plugins.indexOf(matches[2]);
      if (!!~found)
        return bot.say(from, 'Plugin "'+matches[2]+'" already installed.');
      channel.plugins.push(matches[2]);
      channel.markModified('plugins');
      channel.save(function(err){
        if (err) {
          return error(from, 'Error adding saving "'+matches[2]+'" to "'+name+'"', err);
        }
        err = admin.load(channel);
        if (err.length)
          return bot.say(from, 'The following plugins failed to load and were removed: ' + err.join(', '));
        bot.say(from, 'Plugin "'+matches[2]+'" installed!');
      });
    },
    '^unplug (\\S+) (\\S+)': function(from, matches) {
      var name = formatName(matches[1]);
      var channel;
      if (!(channel = getChannel(name, from))) return;
      var found = channel.plugins.indexOf(matches[2]);
      if (!~found)
        return bot.say(from, 'Plugin "'+matches[2]+'" is not installed.');
      channel.plugins.splice(found, 1);
      channel.markModified('plugins');
      channel.save(function(err){
        if (err) 
          return error(from, 'Error saving "'+matches[1]+'"', err);
        admin.load(channel);
        bot.say(from, 'Plugin "'+matches[2]+'" uninstalled!');
      });
    }
  }
};


/**
 * Spin up connection to channel and load plugins
 * Adding as property of module so that `bot.js` can use it
 * @param channel {object} Channel object (refer to storage.js schema)
 */
admin.load = function(channel){

  var errors = [];

  /**
   * Send message to a user
   * @param message {string} Message to send
   * @param [recipient] {string} (Optional) Person to send message to
   */
  channel.say = function(message, recipient) {
    bot.say(recipient || channel.name, message);
  }

  channel.patterns = {};
  _.each(channel.plugins, function(plugin, i){
    try {
      plugin = require('./plugins/'+plugin);
      _.extend(channel.patterns, plugin(channel));
    } catch (e) {
      channel.plugins.splice(i, 1);
      errors.push('[' + plugin + '] - ' + e);
    }
  });

  // Remove broken plugins
  if (errors.length) {
    channel.markModified('plugins');
    channel.save();
  }
  return errors;
}

module.exports = admin;