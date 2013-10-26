# UNiversal Irc Bot

A multi-channel (and eventually multi-server) IRC bot built with Node.js.

### Notes

1. Please don't abuse the mongoDB credentials. I'm too lazy to hide them.
2. Only ProLoser can deploy the IRC bot. If you run locally you should change the bot's nick.
3. Nodejitsu/Nodester expect a webserver to run, that is the only purpose for it at the bottom.
4. We may re-use this project for also hosting/building the website on its own server

## Development

Requires MongoDB

1. Create your own `config.js` from `config.DEFAULT.js` (and change the bot name)
2. `npm install`
3. `node unibot.js`
4. Private message the bot on IRC and say `register #someChannel` to get started
5. After the bot joins the channel, say `!remember [command] is [some value]` without brackets