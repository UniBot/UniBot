var storage   = require('./../storage');
var config    = require('./../../config');

var core = function(channel){
  return {
    "!remember (\\S+) is (.+)": function(from, matches, r) {
      channel.commands[matches[1]] = matches[2];
      storage.update(channel, function(err){
        if (err) {
          r.reply('Error saving "'+matches[1]+'": '+err, from);
          if (config.owner)
            r.reply('Please notify '+config.owner, from);
        } else {
          r.reply('Command "'+matches[1]+'" saved!', from);
        }
      });
    },
    "!forget (\\S+)": function(from, matches, r) {
      delete channel.commands[matches[1]];
      storage.update(channel, function(err){
        if (err) {
          r.reply('Error removing "'+matches[1]+'": '+err, from);
          if (config.owner)
            r.reply('Please notify '+config.owner, from);
        } else {
          r.reply('Command "'+matches[1]+'" forgotten!', from);
        }
      });
    }
  };
};

module.exports = core;
