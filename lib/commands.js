var models   = require('./models');

models.channel.find({}, function(err, rows){
  rows.forEach(function(channel){
    console.log('Joining "'+channel.name+'"...');
    commands.channels[channel.name] = new models.channel({
      name: channel.name,
      commands: channel.commands
    });
    commands.bot.join(channel.name);
  });
});

function update(channelName, callback) {
  return commands.channels[channelName].update({
    $set:{
      commands: commands.channels[channelName].commands
    }
  },{},callback);
}
function create(channelName, callback) {
  commands.channels[channelName] = new models.channel({
    name: channelName,
    commands: {}
  });
  console.log('Creating "'+channelName+'"...');
  return commands.channels[channelName].save(callback);
}
function remove(channelName, callback) {
  delete commands.channels[channelName];
  console.log('Removing "'+channelName+'"...');
  return commands.channels[channelName].remove(callback);
}

var commands = {
  channels: {},
  bot: null,
  pm: {
    'register': function(from, params) {
      if (commands.channels[params[1]]) {
        return commands.bot.say(from, 'Channel "'+params[1]+'" already registered.');
      }
      commands.bot.join(params[1]);
      
      create(params[1], function(err){
        if (err) {
          commands.bot.say(from, 'Error saving "'+params[1]+'": '+err);
          console.log('Error saving "'+params[1]+'"', err);
        } else {
          commands.bot.say(from, 'Channel "'+params[1]+'" registered!');
        }
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
    commands.bot.say(channel, commands.channels[channel].commands[params[0]]);
  }
};

module.exports = commands;