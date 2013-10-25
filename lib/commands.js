var storage   = require('./storage');
var _        = require('lodash');

var commands = {
  channels: {},
  bot: null,
  join: function(){
    list(function(err, channels){
      channels.forEach(function(channel){
        if (config.debug)
          console.log('Joining "'+channel.name+'"...');
        commands.channels[channel.name] = channel;
        commands.bot.join(channel.name);
      });
    });
  },
  pm: {
    'register': function(from, params) {
      if (params[1][0] !== '#') {
        params[1] = '#'+params[1];
      }
      if (commands.channels[params[1]]) {
        return commands.bot.say(from, 'Channel "'+params[1]+'" already registered.');
      }
      commands.bot.join(params[1], function(){
        console.log(arguments);
        create(params[1], function(err){
          if (err) {
            commands.bot.say(from, 'Error saving "'+params[1]+'": '+err);
            console.log('Error saving "'+params[1]+'"', err);
          } else {
            commands.bot.say(from, 'Channel "'+params[1]+'" registered!');
          }
        });
      });
    },
    'unregister': function(from, params) {
      if (!commands.channels[params[1]]) {
        return commands.bot.say(from, 'Channel "'+params[1]+'" isn\'t registered.');
      }
      commands.bot.part(params[1]);
      remove(params[1], function(err){
        if (err) {
          commands.bot.say(from, 'Error saving "'+params[1]+'": '+err);
        } else {
          commands.bot.say(from, 'Channel "'+params[1]+'"  unregistered!');
        }
      });
    },
    'debug': function(from, params) {
      console.log(commands.channels[params[1]]);
    }
  },
  message: {
    '!remember': function(from, channel, params) {
      if (params.length < 3) return;
      key = params[1];
      value = params.slice(2).join(' ');
      commands.channels[channel].commands[key] = value;
      update(channel, function(err){
        if (err) {
          commands.bot.say(from, 'Error saving "'+params[1]+'": '+err);
        } else {
          commands.bot.say(from, 'Command "'+params[1]+'"  saved!');
        }
      });
    },
    '!forget': function(from, channel, params) {
      delete commands.channels[channel].commands[params[1]];
      update(channel, function(err){
        if (err) {
          commands.bot.say(from, 'Error removing "'+params[1]+'": '+err);
        } else {
          commands.bot.say(from, 'Command "'+params[1]+'"  forgotten!');
        }
      });
    }
  },
  say: function(from, channel, params) {
    var message = commands.channels[channel].commands[params[0]];
    var tokens = params.slice(1).join('+');
    message = message.replace(/(\:tokens)/ig, tokens);
    message = message.replace(/(\:nick)/ig, from);
    commands.bot.say(channel, message);
  }
};

module.exports = commands;
