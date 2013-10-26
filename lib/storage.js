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
    default: []
  },
  commands: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
});

var model = mongoose.model('Channel', Channel);

var storage = {
  mongoose: mongoose,
  model: model,
  channels: {}
};

module.exports = storage;