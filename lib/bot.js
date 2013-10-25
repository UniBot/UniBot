var irc      = require("irc");
var _        = require("lodash");
var storage  = require('./storage');
var config   = require('./../config');

var bot = new irc.Client(config.server, config.irc.userName, config.irc);

/**
 * Spin up connection to channel and load plugins
 * @param channel {object} Channel object (refer to storage.js schema)
 */
function load(channel, callback){

  /**
	 * Send message to a user
	 * @param message {string} Message to send
	 * @param [recipient] {string} (Optional) Person to send message to
	 */
	channel.say = function(message, recipient) {
		bot.say(recipient || channel.name, message);
	}

	channel.patterns = {};
	_.each(channel.plugins, function(plugin){
		plugin = require('./plugins/'+plugin);
		_.extend(channel.patterns, plugin(channel));
	});

	if (config.debug)
    console.log('Joining "'+channel.name+'"...');
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

// @TODO Relocate this somewhere else?
var manage = {
  'register': function(from, params) {
    if (params[1][0] !== '#') {
      params[1] = '#'+params[1];
    }
    if (config.owner && from.toUpperCase() !== config.owner.toUpperCase()) {
      return bot.say(from, 'Please contact '+config.owner+' if you would like to add UniBot to your channel.');
    }
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
    if (params[1][0] !== '#') {
      params[1] = '#'+params[1];
    }
    if (config.owner && from.toUpperCase() !== config.owner.toUpperCase()) {
      return bot.say(from, 'Please contact '+config.owner+' if you would like to remove UniBot from your channel.');
    }
    if (!storage.channels[params[1]]) {
      return bot.say(from, 'Channel "'+params[1]+'" isn\'t registered.');
    }
    bot.part(params[1]);
    storage.remove(params[1], function(err){
      if (err) {
        bot.say(from, 'Error saving "'+params[1]+'": '+err);
      } else {
        bot.say(from, 'Channel "'+params[1]+'"  unregistered!');
      }
    });
  }
};

var PM_COMMAND = /^!(\S+)\s+for\s+(#\S+)(\s+(.+)?)?$/;
bot.addListener("pm", function(from, message) {
  var params = message.split(' ');
  if (params.length > 1 && manage[params[0]]) {
    manage[params[0]](from, params);
  } else {
    var matches = PM_COMMAND.exec(message);
    if (matches !== null) {
      var cmd = matches[1],
          channelName = matches[2],
          msg = matches[4] || "",
          channel = storage.channels[channelName],
          cmdmsg = ['!' + cmd, msg].join(" ");

      if (channel && channel.commands[cmd]) {
        doCommand(from, channel, cmdmsg);
      } else {
        var found;
        _.each(channel.patterns, function(callback, pattern) {
          expression = new RegExp(pattern, 'i');
          var matches = expression.exec(cmdmsg);
          if (matches) {
            found = true;
            callback(from, matches);
          }
        });
        if (!found) {
          // Log error
          console.log("Command '" + cmd + "' not available for '" + channelName);
        }
      }
    }
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