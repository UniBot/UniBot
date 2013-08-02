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
  "mongo" : process.env.UNIBOT_MONGO || "mongodb://nodejitsu:ad6d282c750802b49ec763a0cb191559@linus.mongohq.com:10030/nodejitsudb7006161983",
  "irc" : {
    "server" : "irc.freenode.net",
    "nick" : "uibot",
    "log" : false,
    "channels" : ['#angularjs'],
    "flood_protection" : true,
    "user" : {
      "username" : "uibot",
      "realname" : "Universal IRC Bot"
    }
  }
};