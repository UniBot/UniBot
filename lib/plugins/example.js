var plugin = function(channel){
  return {
  
    // RegExp: callback(from, regexMatches) 
    "^hi\ unibot": function(from, matches) {
    
      // do complex logic...
      channel.say('Hello '+from);
      
    }
  };
};

// plugin.model = mongoose.model() // Optional model for mongo connection
 
module.exports = plugin;
