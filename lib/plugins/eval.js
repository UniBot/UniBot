var plugin = function(channel){

  return {
    "^~~(.+)": function(from, matches) {
      channel.say(from + '  output: ' + eval(matches[1]);
    }
  };
};

module.exports = plugin;
