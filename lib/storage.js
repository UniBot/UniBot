// Setup Mongo
var mongoose = require('mongoose');
var config   = require('./../config');
var Schema   = mongoose.Schema;

mongoose.connect(config.mongo);

if (config.debug)
  mongoose.set('debug', true);

var Channel = new Schema({
  // commands : ,
  name  : {
    type  : String,
    index : {
      unique   : true,
      dropDups : false
    }
  },
  plugins : {
    type: Array,
    default: ['core']
  },
  commands: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
});

var channel = mongoose.model('Channel', Channel);

var storage = {
  channels: {},
  update: function(channel, callback) {
    channel.markModified('commands');
    channel.save(callback);
  },
  create: function(channelName, callback) {
    channel = new channel({
      name: channelName
    });
    if (config.debug)
      console.log('Creating "'+channelName+'"...');
    channel.save(function(err, channel){
      if (!err)
        storage.channels[channelName] = channel;
      callback(err, channel);
    });
  },
  remove: function(channelName, callback) {
    if (config.debug)
      console.log('Removing "'+channelName+'"...');
    storage.channels[channelName].remove(function(err, channel){
      delete storage.channels[channelName];
      callback(err, channel);
    });
  },
  list: function(callback) {
    channel.find({}, function(err, channels){
      channels.forEach(function(channel){
        storage.channels[channel.name] = channel;
      });
      callback(err, channels);
    });
  }
};

module.exports = storage;