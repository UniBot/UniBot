// Setup Mongo
var mongoose = require('mongoose');
var config   = require('./../config');
var Schema = mongoose.Schema;

mongoose.connect(config.mongo);

var Log = new Schema({
  time    : String,
  user    : String,
  say     : String,
  channel : String
});
var Seen = new Schema({
  time : String,
  say  : String,
  channel : String,
  user : {
    type : String,
    index : {
      unique : true,
      dropDups: false
    }
  }
});
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
    default: []
  },
  commands: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
});

var storage = {
  channels: {},
  update: function(channelName, callback) {
    commands.channels[channelName].markModified('commands');
    return commands.channels[channelName].save(callback);
  },
  create: function(channelName, callback) {
    commands.channels[channelName] = new models.channel({
      name: channelName,
      commands: {}
    });
    if (config.debug)
      console.log('Creating "'+channelName+'"...');
    return commands.channels[channelName].save(callback);
  },
  remove: function(channelName, callback) {
    if (config.debug)
      console.log('Removing "'+channelName+'"...');
    return commands.channels[channelName].remove(function(err, res){
      delete commands.channels[channelName];
      callback(err, res);
    });
  },
  list: function(callback) {
    return models.channel.find({}, function(err, channels){
      channels.forEach(function(channel){
        storage.channels[channel.name] = channel;
      });
    });
  }
};

module.exports = storage;