# UniBot = UNiversal Irc Bot

A multi-channel (and eventually multi-server) IRC bot built with Node.js.

### Notes

1. Please don't abuse the mongoDB credentials. I'm too lazy to hide them.
2. You should change the bot's nick and owner.
## Development

Requires MongoDB

1. Create your own `config.js` from `config.DEFAULT.js` **(and change the bot name)**
2. `npm install`
3. `node unibot.js`
4. [Register the channel](#pm)
5. [Install plugins](#plugins)

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
* `unregister [#channel]` Leaves a channel and destroys the record (WARNING: Delete all commands!)
* `plugin [#channel] [plugin]` Adds a plugin to a channel
* `unplug [#channel] [plugin]` Removes a plugin from a channel

### Channel

Grouped by Plugin

#### Commands

**Note:** `:tokens` are replaced with any text after the command name. Spaces are replaced with `+` characters (for search-engine friendliness)
**Note:** `:nick` is replaced with the name of the user who sent the message

* `!remember [command] is [text with optional :tokens and :nick]` Create a **!command**
* `!forget [command]` Delete a **!command**
* `[nick:] ![command] [tokens]` Say a command
