var storage   = require('./../storage');
var config    = require('./../../config');

var plugin = function(channel){
  return {
    // Execute Command
    // [nick:] !command [tokens]
    "(?:(\\S+): )?(?:!(\\S+))(?: (.+))?": function(from, matches) {
      if (!channel.commands[matches[2]]) return;
      if (matches[1]) from = matches[1];
      var message = channel.commands[matches[2]];
      var tokens = matches[3] || '';
      tokens = tokens.split(' ').join('+');
      message = message.split(':tokens').(tokens);
      message = message.split(':nick').join(from);
      channel.say(message);
    },
    // Save Command
    "^!remember (\\S+) is (.+)": function(from, matches) {
      channel.commands[matches[1]] = matches[2];
      channel.markModified('commands');
      channel.save(function(err){
        if (err) {
          channel.say('Error saving "'+matches[1]+'": '+err, from);
          if (config.owner)
            channel.say('Please notify '+config.owner, from);
        } else {
          channel.say('Command "'+matches[1]+'" saved!', from);
        }
      });
    },
    // Delete Command
    "^!forget (\\S+)": function(from, matches) {
      delete channel.commands[matches[1]];
      channel.markModified('commands');
      channel.save(function(err){
        if (err) {
          channel.say('Error removing "'+matches[1]+'": '+err, from);
          if (config.owner)
            channel.say('Please notify '+config.owner, from);
        } else {
          channel.say('Command "'+matches[1]+'" forgotten!', from);
        }
      });
    }
  };
};

module.exports = plugin;
