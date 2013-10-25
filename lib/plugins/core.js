var storage   = require('./../storage');
var config    = require('./../../config');

var core = function(channel){
  return {
    "!remember (\\S+) is (.+)": function(from, matches) {
      channel.commands[matches[1]] = matches[2];
      storage.update(channel, function(err){
        if (err) {
          channel.say('Error saving "'+matches[1]+'": '+err, from);
          if (config.owner)
            channel.say('Please notify '+config.owner, from);
        } else {
          channel.say('Command "'+matches[1]+'" saved!', from);
        }
      });
    },
    "!forget (\\S+)": function(from, matches) {
      delete channel.commands[matches[1]];
      storage.update(channel, function(err){
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

module.exports = core;
