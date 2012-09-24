/**
 * INSTRUCTIONS:
 *
 * Copy and paste me into "config.js"
 *
 * Update connection URI as needed
 *
 * Do NOT commit "config.js"
 */
module.exports = {
  "port" : 20415,
  "mongo" : "mongodb://username:pass@host:27017/dbname",
  "irc" : {
    "server" : "irc.freenode.net",
    "nick" : "unibot",
    "log" : false,
    "channels" : ['#'],
    "flood_protection" : true,
    "user" : {
      "username" : "unibot",
      "realname" : "Universal IRC Bot"
    }
  }
};