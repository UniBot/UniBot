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
  "mongo" : process.env.UNIBOT_MONGO || "mongodb://localhost:27017/unibot",
  "server": 'irc.freenode.net',
  "owner": "ProLoser",
  "debug": false,
  "irc" : {
    userName: 'UniBot2',
    realName: 'UniBot Freenode Bot',
    nick: 'UniBot2', 
    // password: 'unibot',
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