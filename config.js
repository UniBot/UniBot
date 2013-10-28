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
  "server": 'irc.freenode.net',
  "owner": "ProLoser",
  "debug": false,
  "irc" : {
    userName: 'UniBot',
    realName: 'UniBot Freenode Bot',
    nick: 'UniBot', 
    password: 'unibot',
    port: 6667,
    debug: false,
    showErrors: false,
    autoRejoin: true,
    autoConnect: true,
    channels: [], // Leave Empty
    secure: false,
    selfSigned: false,
    certExpired: false,
    floodProtection: false,
    floodProtectionDelay: 1000,
    sasl: false,
    stripColors: false,
    channelPrefixes: "&#",
    messageSplit: 512
  }
};