/**
 * UniBot Configuration
 */
module.exports = process.env.UNIBOT && JSON.parse(process.env.UNIBOT) || {
  "port" : 1337,
  "mongo" : "mongodb://localhost/unibot",
  "server": "irc.freenode.net",
  "owner": false, // "ProLoser", Used for PMing error notifications on IRC
  "debug": true, // false
  "irc" : {
    "userName": "MyBot",
    "realName": "Universal Bot",
    // nick: "MyBot", // Authentication
    // password: "MyBot", // Authentication
    "port": 6667,
    "debug": false,
    "showErrors": false,
    "autoRejoin": true,
    "autoConnect": true,
    "channels": [], // Leave Empty
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