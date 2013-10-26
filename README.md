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
5. After the bot joins the channel, say `!remember [command] is [some value]`

## Plugins

Create new plugins in `lib/plugins`

* Add plugins by private messaging the bot `plugin [channel] [plugin]`
* Remove plugins by private messaging the bot `unplug [channel] [plugin]`

### Example:

**github.js**
```
module.exports = function(channel){
  return {
  	// Regular expression to match
    "#([0-9]+)": function(from, matches) {
    	// do logic ...
    	channel.say('Some message'); // pass a recipient name as an optional second argument
    },
    "...": function(from, matches) {
      	...
	}
  };
};
```

## Commands

### PM

* `register [#channel]` Creates a new channel and joins
* `register [#channel]` Leaves a channel and destroys the record (WARNING: Delete all commands!)
* `plugin [#channel] [plugin]` Adds a plugin to a channel
* `unplug [#channel] [plugin]` Removes a plugin from a channel

### Channel

Grouped by Plugin

#### Core

* `!remember [command] is [text with optional :tokens and :nick]` Create a **!command**
* `!forget [command]` Delete a **!command**