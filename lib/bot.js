var irc      = require("irc");
var _        = require("lodash");
var storage  = require('./storage');
var config   = require('./../config');
var admin    = require('./admin');

var bot = new irc.Client(config.server, config.irc.userName, config.irc);
var adminPatterns    = admin(bot);

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
 * Iterates through a patterns object and calls the corresponding callback if it match
 * @param patterns {hash{String:Function}} "PatternString":callback(from, matches)
 * @param message {String} Message to check patterns against
 */
function callPatterns(patterns, message, from) {
  _.each(patterns, function(callback, pattern){
    expression = new RegExp(pattern, 'i');
    var matches = expression.exec(message);
    if (matches) {
      callback(from, matches);
    }
  });
}

/**
 * Bot connected to server!
 */
bot.addListener("registered", function(message){
  if (config.owner && bot)
    bot.say(config.owner, "Connected!");

  storage.model.find(function(err, channels){
    channels.forEach(function(channel){
      storage.channels[channel.name] = channel;
	    admin.load(channel);
      bot.join(channel.name);
	  });
	});
});

/**
 * Administrative commands directly to bot. Look in `admin.js`
 */
bot.addListener("pm", function(from, message) {
  var params = message.split(' ');
  callPatterns(adminPatterns, message, from);
});

/**
 * Message received in connected channel
 */
bot.addListener("message#", function(from, channel, message) {
	channel = storage.channels[channel];
	callPatterns(channel.patterns, message, from);
});

/**
 * Any IRC Error event
 */
bot.addListener("error", function(error) {
  console.log('error', error);
  if (config.owner && bot)
    bot.say(config.owner, "ERROR: "+error.args.join(' : '));
});