// Setup Mongo
var mongoose = require('mongoose');

var Channel = new mongoose.Schema({
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
  }
});

module.exports = mongoose.model('Channel', Channel);