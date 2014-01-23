/**
 * UniBot Configuration
 */
 module.exports = process.env.UNIBOT && JSON.parse(process.env.UNIBOT) || {
  "port" : 80,
  "mongo" : "mongodb://nodejitsu:ad6d282c750802b49ec763a0cb191559@linus.mongohq.com:10030/nodejitsudb7006161983",
  "server": "irc.freenode.net",
  "owner": "ProLoser",
  "debug": true,
  "irc" : {
    "userName": "UniBot",
    "realName": "UniBot Freenode Bot",
    "nick": "UniBot",
    "password": "unibot",
    "port": 6667,
    "debug": true,
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