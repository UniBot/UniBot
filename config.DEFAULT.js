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
  "mongo" : process.env.UNIBOT_MONGO || "mongodb://username:pass@host:27017/dbname",
  "server": 'irc.freenode.net',
  "owner": "ProLoser", // Used for pming error notifications on IRC
  "irc" : {
    "userName": 'mybot',
    "realName": 'UniBot Freenode Bot',
    "port": 6667,
    "debug": false,
    "showErrors": false,
    "autoRejoin": true,
    "autoConnect": true,
    "channels": [],
    "secure": false,
    "selfSigned": false,
    "certExpired": false,
    "floodProtection": false,
    "floodProtectionDelay": 1000,
    "sasl": false,
    "stripColors": false,
    "channelPrefixes": "&#",
    "messageSplit": 512
  }
};