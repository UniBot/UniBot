/**
 * UniBot
 * An IRC bot for any channel on irc.freenode.net
 * @license MIT
 */

var express  = require('express');
var irc      = require("irc");
var config   = require('./config');
var commands = require("./lib/commands");

var bot = new irc.Client(config.server, config.irc.userName, config.irc);

commands.bot = bot;

bot.addListener("pm", function(from, message) {
  var params = message.split(' ');
  if (params.length > 1 && commands.pm[params[0]]) {
    commands.pm[params[0]](from, params);
  }
});

bot.addListener("message#", function(from, channel, message) {
  var params = message.split(' ');
  if (commands.message[params[0]]) {
    commands.message[params[0]](from, channel, params);
  } else if (commands.channels[channel] && commands.channels[channel].commands[params[0]]) {
    commands.say(from, channel, params);
  }
});

bot.addListener("error", function(error) {
  console.log('error', error);
  if (config.owner && commands.bot)
    commands.bot.say(config.owner, "ERROR: "+error);
});

// app.listen(config.port);