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
  commands: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
});

module.exports = {
  log: mongoose.model('Log', Log),
  seen: mongoose.model('Seen', Seen),
  channel: mongoose.model('Channel', Channel)
};