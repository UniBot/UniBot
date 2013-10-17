var models   = require('./models');

models.channel.find({}, function(err, rows){
  rows.forEach(function(channel){
    console.log('Joining "'+channel.name+'"...');
    commands.channels[channel.name] = new models.channel(channel);
    commands.bot.join(channel.name);
  });
});

var commands = {
  channels: {},
  bot: null,
  pm: {
    'register': function(from, params) {
      if (commands.channels[params[1]]) {
        return commands.bot.say(from, 'Channel "'+params[1]+'" already registered.');
      }
      commands.bot.join(params[1]);
      console.log(params);
      commands.channels[params[1]] = new models.channel({ name: params[1], commands: {} });
      commands.channels[params[1]].save(function(err){
        if (err) {
          commands.bot.say(from, 'Error saving "'+params[1]+'": '+err);
          console.log('Error saving "'+params[1]+'"', err);
        } else {
          commands.bot.say(from, 'Channel "'+params[1]+'" registered!');
        }
      })
    },
    'unregister': function(from, params) {
      if (!commands.channels[params[1]]) {
        return commands.bot.say(from, 'Channel "'+params[1]+'" isn\'t registered.');
      }
      commands.bot.part(params[1]);
      commands.channels[params[1]].remove(function(err){
        if (err) {
          commands.bot.say(from, 'Error saving "'+params[1]+'": '+err);
        } else {
          commands.bot.say(from, 'Channel "'+params[1]+'"  unregistered!');
          delete commands.channels[params[1]];
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
      commands.channels[channel].set('commands["'+[params[1]]+'"]', params.slice(2).join(' '));
      commands.channels[channel].update({}, {}, function(err){
        if (err) {
          commands.bot.say(from, 'Error saving "'+params[1]+'": '+err);
        } else {
          commands.bot.say(from, 'Command "'+params[1]+'"  saved!');
        }
      });
    },
    '!forget': function(from, channel, params) {
      delete commands.channels[channel].commands[params[1]];
      commands.channels[channel].unset();
      commands.channels[channel].update();
    }
  },
  say: function(from, channel, params) {
    commands.bot.say(channel, commands.channels[channel].commands[params[0]]);
  }
};

module.exports = commands;