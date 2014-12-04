// Executed once per bot

var plugin = function(channel, config){
  // Executed once per channel
  

  return {
  
    // RegExp: callback(from, regexMatches) 
    "^hi\\ unibot": function(from, matches) {
    
      // do complex logic...
      
      channel.say('Hello ' + from); // in-channel reply
      channel.say('Hello', from); // private reply
      
    }
  };
};

// plugin.model = mongoose.model() // Optional model for mongo connection
 
module.exports = plugin;
