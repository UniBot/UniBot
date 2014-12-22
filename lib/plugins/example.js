// If you want a DB connection
var mongoose = require('mongoose');

// Executed once per bot

var plugin = function(channel, config){
  // Executed once per channel
  
  // channel.join(function(who){ /* do something */ });
  // channel.leave(function(who, reason){ /* do something */ });
  // regexpattern, callback
  channel.message('^hi unibot', function(from, matches){
    channel.say('Hello ' + from); // in-channel reply
    channel.say('Hello', from); // private reply
  });
};

plugin.load = function(app) {
  app.get('/example', function(req, res, next){
    res.sendFile('example.html');
  });
  app.get('/example/:channel', function(req, res, next) {
    mongoose.model(...).findOne({ channel: req.params.channel }, function(err, example){
      res.send(err || example);
    });
  });
}
 
module.exports = plugin;
