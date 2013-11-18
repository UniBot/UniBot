var plugin = function(channel){
  return {
  
    // RegExp: callback(from, regexMatches) 
    "^hi\ unibot": function(from, matches) {
    
      // do complex logic...
      channel.say('Hello '+from);
      
    }
  };
};
 
module.exports = plugin;
