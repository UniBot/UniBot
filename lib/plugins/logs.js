var storage   = require('./../storage');
var config    = require('./../../config');

var Logs = new storage.mongoose.Schema({
  channel : {
    type  : String, // channel._id
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
        logs = new model({
          channel: channel.id
        });
      }
      logs.logs.push({ from: from, message: matches[0], timestamp: Date.now() });
      logs.markModified('logs');
      logs.save();
    }
  };
};

plugin.model = model;

module.exports = plugin;