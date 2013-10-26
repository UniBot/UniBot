var storage   = require('./../storage');
var config    = require('./../../config');

var Logs = new storage.mongoose.Schema({
  // commands : ,
  channel : {
    type  : String,
    index : {
      unique   : true,
      dropDups : false
    }
  },
  logs : {
    type: [storage.mongoose.Schema.Types.Mixed],
    default: []
  }
});

var model = storage.mongoose.model('Logs', Logs);

var plugin = function(channel){
  var logs;
  return {
    "(.+)": function(from, matches) {
      if (!logs) {
        channel = new model({
          channel: channel.id
        });
      }
      channel.logs.push({ from: from, message: matches[0], timestamp: Date.now() });
      channel.markModified('logs');
      channel.save();
    }
  };
};

plugin.model = model;

module.exports = plugin;