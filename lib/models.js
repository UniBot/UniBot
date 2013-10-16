// Setup Mongo
var mongoose = require('mongoose');
var config   = require('./../config');
var Schema = mongoose.Schema;

mongoose.connect(config.mongo);

var Command = new Schema({
  key   : String,
  value : String
});
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
  commands: Object
});

module.exports = {
  command: mongoose.model('Command', Command),
  log: mongoose.model('Log', Log),
  seen: mongoose.model('Seen', Seen),
  channel: mongoose.model('Channel', Channel)
};