/**
 * Evaluates a javascript expression
 */

var plugin = function(channel, config){

  return {
    // Example: ~~2+2
    "^~~(.+)": function(from, matches) {
      channel.say(from + '  output: ' + eval(matches[1]);
    }
  };
};

module.exports = plugin;
