# UNiversal Irc Bot

A multi-channel (and eventually multi-server) IRC bot built with Node.js.

### Notes

1. Please don't abuse the mongoDB credentials. I'm too lazy to hide them.
2. Only ProLoser can deploy the IRC bot. If you run locally you should change the bot's nick.
3. Nodejitsu/Nodester expect a webserver to run, that is the only purpose for it at the bottom.
4. We may re-use this project for also hosting/building the website on its own server

## Development

1. Customize the `options` variable (you may want to turn logging on)
2. `npm install`
3. `node ircbot.js`
