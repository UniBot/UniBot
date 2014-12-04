var irc      = require("irc");
var config   = require('./../config');

irc = new irc.Client(config.server, config.irc.userName, config.irc);

// Add logging to joins and parts
var join = irc.join;
irc.join = function(channel){
  if (config.debug)
    console.log('Joining "'+channel+'"...');
  return join.apply(irc, Array.prototype.slice.call(arguments));
};

var part = irc.part;
irc.part = function(channel){
  if (config.debug)
    console.log('Joining "'+channel+'"...');
  return part.apply(irc, Array.prototype.slice.call(arguments));
};


/**
 * Any IRC Error event
 */
irc.addListener("error", function(error) {
  console.log('error', error);
  if (config.owner && irc)
    irc.say(config.owner, "ERROR: "+error.args.join(' : '));
});

module.exports = irc;