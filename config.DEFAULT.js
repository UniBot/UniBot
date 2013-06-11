/**
 * INSTRUCTIONS:
 *
 * Copy and paste me into "config.js"
 *
 * Update connection URI as needed
 *
 * Do NOT commit "config.js"
 */
module.exports = process.env.UNIBOT_CONFIG || {
  "port" : 20415,
  "mongo" : process.env.MONGO || "mongodb://username:pass@host:27017/dbname",
  "irc" : {
    "server" : "irc.freenode.net",
    "nick" : "unibot",
    "log" : false,
    "channels" : ['#somechannel'],
    "flood_protection" : true,
    "user" : {
      "username" : "unibot",
      "realname" : "Universal IRC Bot"
    }
  }
};