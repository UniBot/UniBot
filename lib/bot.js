var irc      = require("irc");
var _        = require("lodash");
var storage  = require('./storage');
var config   = require('./../config');

var bot = new irc.Client(config.server, config.irc.userName, config.irc);

// Add logging to joins and parts
var join = bot.join;
bot.join = function(channel){
  if (config.debug)
    console.log('Joining "'+channel+'"...');
  return join.apply(bot, Array.prototype.slice.call(arguments));
}
var part = bot.part;
bot.part = function(channel){
  if (config.debug)
    console.log('Joining "'+channel+'"...');
  return part.apply(bot, Array.prototype.slice.call(arguments));
}

/**
 * Spin up connection to channel and load plugins
 * @param channel {object} Channel object (refer to storage.js schema)
 */
function load(channel){

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
      errors.push(plugin);
    }
	});

  // Remove broken plugins
  if (errors.length) {
    channel.markModified('plugins');
    channel.save();
  }
  return errors;
}

/**
 * Basic response to common !command
 * @param from {string} Person who said the command
 * @param channel {string} Channel command was said in
 * @param message {string} Message sent by user
 */
function doCommand(from, channel, message) {
	var params = message.split(' ');
  var message = channel.commands[params[0].substr(1)];
  var tokens = params.slice(1).join('+');
  message = message.replace(/(\:tokens)/ig, tokens);
  message = message.replace(/(\:nick)/ig, from);
  channel.say(message);
}

bot.addListener("registered", function(message){
  if (config.owner && bot)
    bot.say(config.owner, "Connected!");

  storage.list(function(err, channels){
	  channels.forEach(function(channel){
	    load(channel);
      bot.join(channel.name);
	  });
	});
});

function isRegistered(channel) {
  if (!storage.channels[channel]) {
    bot.say(from, 'Channel "'+channel+'" isn\'t registered.');
    return false;
  } else {
    return true;
  }
}

// @TODO Relocate this somewhere else?
var manage = {
  'register': function(from, params) {
    if (storage.channels[params[1]]) {
      return bot.say(from, 'Channel "'+params[1]+'" already registered.');
    }

    bot.join(params[1], function(){
      storage.create(params[1], function(err, channel){
        if (err) {
          bot.say(from, 'Error saving "'+params[1]+'": '+err);
          console.log('Error saving "'+params[1]+'"', err);
        } else {
          load(channel);
          bot.say(from, 'Channel "'+params[1]+'" registered!');
        }
      });
    });
  },
  'unregister': function(from, params) {
    if (!isRegistered(params[1])) return;
    bot.part(params[1]);
    storage.remove(params[1], function(err){
      if (err) {
        bot.say(from, 'Error removing "'+params[1]+'": '+err);
      } else {
        bot.say(from, 'Channel "'+params[1]+'"  unregistered!');
      }
    });
  },
  'plugin': function(from, params) {
    if (!isRegistered(params[1])) return;
    var found = channel.plugins.indexOf(params[2]);
    if (!!~found)
      return bot.say(from, 'Plugin '+params[2]+' already installed.');
    channel.plugins.push(params[2]);
    channel.markModified('plugins');
    channel.save(function(err){
      if (err) 
        return bot.say(from, 'Error saving "'+params[1]+'": '+err);
      err = load(channel);
      if (err.length) {

        return bot.say(from, 'The following plugins failed to load and were removed: ' + err.join(', '));
      }
      bot.say('Plugin '+params[2]+' installed!');
    });
  },
  'unplug': function(from, params) {
    if (!isRegistered(params[1])) return;
    var found = channel.plugins.indexOf(params[2]);
    if (!~found)
      return bot.say(from, 'Plugin '+params[2]+' is not installed.');
    channel.plugins.splice(found, 1);
    channel.markModified('plugins');
    channel.save(function(err){
      if (err) 
        return bot.say(from, 'Error saving "'+params[1]+'": '+err);
      load(channel);
      bot.say('Plugin '+params[2]+' uninstalled!');
    });
  }
};

bot.addListener("pm", function(from, message) {
  var params = message.split(' ');
  if (params.length > 1 && manage[params[0]]) {
    if (config.owner && from.toUpperCase() !== config.owner.toUpperCase()) {
      return bot.say(from, 'Please contact '+config.owner+' to '+params[0]+'.');
    }
    // Standardize channel names
    if (params[1][0] !== '#') {
      params[1] = '#'+params[1];
    }
    manage[params[0]](from, params);
  }
});

bot.addListener("message#", function(from, channel, message) {
	channel = storage.channels[channel];
	var params = message.split(' ');
  if (
  	params[0].length > 1
  	&& params[0][0] === '!'
  	&& channel.commands[params[0].substr(1)]
  ) {
  	doCommand(from, channel, message);
  } else {
  	// @FIXME Not super performant?
  	_.each(channel.patterns, function(callback, pattern){
  		expression = new RegExp(pattern, 'i');
  		var matches = expression.exec(message);
  		if (matches) {
  			callback(from, matches);
  		}
  	});
  }
});

bot.addListener("error", function(error) {
  console.log('error', error);
  if (config.owner && bot)
    bot.say(config.owner, "ERROR: "+error.args.join(' : '));
});