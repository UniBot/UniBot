var irc      = require("irc");
var _        = require("lodash");
var storage  = require('./storage');
var config   = require('./../config');
var bot      = new irc.Client(config.server, config.irc.userName, config.irc);
var admin    = require('./admin')(bot);
var dns      = require('dns');
var os       = require('os');

// Add logging to joins and parts
var join = bot.join;
bot.join = function(channel){
  if (config.debug)
    console.log('Joining "'+channel+'"...');
  return join.apply(bot, Array.prototype.slice.call(arguments));
};
var part = bot.part;
bot.part = function(channel){
  if (config.debug)
    console.log('Joining "'+channel+'"...');
  return part.apply(bot, Array.prototype.slice.call(arguments));
};

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
  // If a password is available, check for ghosts
  if (config.irc.password) bot.say('nickserv', 'ghost ' + config.irc.userName || config.irc.nick + ' ' + config.irc.password);
  // Confirm username is correct
  bot.send("NICK", config.irc.userName || config.irc.nick);
  if (config.owner && bot) {
    dns.lookup(os.hostname(), function (err, ip, fam) {
      bot.say(config.owner, "Connected! IP:" + ip);
    });
  }

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
  if (admin.patterns)
    callPatterns(admin.patterns, message, from);
  else
    bot.say(config.owner, "Error: Admin Patterns not found when '"+from+"' executed '"+message+"'");
});

/**
 * Message received in connected channel
 */
bot.addListener("message#", function(from, channelName, message) {
  if (from == config.irc.userName || from == config.irc.nick) return;
  channel = storage.channels[channelName];
  if (channel.patterns)
  	callPatterns(channel.patterns, message, from);
  else
    bot.say(config.owner, "Error: Channel '"+channelName+"' Patterns not found");
});

/**
 * Any IRC Error event
 */
bot.addListener("error", function(error) {
  console.log('error', error);
  if (config.owner && bot)
    bot.say(config.owner, "ERROR: "+error.args.join(' : '));
});
