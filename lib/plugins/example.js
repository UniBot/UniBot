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

// plugin.model = mongoose.model() // Optional model for mongo connection
 
module.exports = plugin;
