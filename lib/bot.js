var config   = require('./../config');
var Channel  = require('./Channel');
var _        = require('lodash');
var externalip = require('externalip');
var irc      = require("irc");

var channels = {};

var bot = new irc.Client(config.server, config.irc.userName, config.irc);

bot.plugins = {};
bot.addPlugin = function(name, plugin) {
	bot.plugins[name] = plugin;
}

/**
 * Iterates through a patterns object and calls the corresponding callback if it match
 * @param patterns {hash{String:Function}} "PatternString":callback(from, matches)
 * @param message {String} Message to check patterns against
 */
function callPatterns(plugins, message, from) {
	_.each(plugins, function(patterns, plugin){
		_.each(patterns, function(callback, pattern){
			expression = new RegExp(pattern, 'i');
			var matches = expression.exec(message);
			if (matches) {
				callback(from, matches);
			}
		});
	});
}
function getChannel(name, from) {
	name = formatName(name);
	if (!channels[name]) {
		error(from, 'Channel "'+name+'" isn\'t registered.');
	} else {
		return channels[name];
	}
}
function formatName(name) {
	if (name[0] !== '#')
		name = '#'+name;
	return name.toLowerCase();
}
function error(to, message, err) {
	bot.say(to, message + ': ' + err);
	console.log(message, 'User: ' + to, err);
}

/**
 * Spin up connection to channel and load plugins
 * @param channel {object} Channel object (refer to storage.js schema)
 */
function loadPatterns(channel){

	var errors = [];

	/**
	 * Send message to a user
	 * @param message {string} Message to send
	 * @param [recipient] {string} (Optional) Person to send message to
	 */
	channel.say = function(message, recipient) {
		bot.say(recipient || channel.name, message);
	};

	channel.patterns = {};
	_.each(channel.plugins, function(plugin, i){
		if (bot.plugins[plugin]) {
			channel.patterns[plugin] = bot.plugins[plugin](channel, config);
		} else {
			channel.plugins.splice(i, 1);
			errors.push(plugin);
		}
	});

	// Remove broken plugins
	if (errors.length) {
		channel.markModified('plugins');
		channel.save();
	}
	return errors;
}

var adminPatterns = { admin: {
	'^register (\\S+)': function(from, matches) {
		var name = formatName(matches[1]);
		if (channels[name]) {
			return bot.say(from, 'Channel "'+name+'" already registered.');
		}

		bot.join(name, function(){
			var channel = new Channel({
				name: name
			});
			channel.save(function(err, channel){
				if (err) {
					error(from, 'Error registering "'+name+'"', err);
				} else {
					channels[name] = channel;
					loadPatterns(channel);
					bot.say(from, 'Channel "'+name+'" registered!');
				}
			});
		});
	},
	'^unregister (\\S+)': function(from, matches) {
		var channel = getChannel(matches[1], from);
		if (!channel) return;
		bot.part(channel.name);
		delete channels[channel.name];
		channel.remove(function(err){
			if (err) {
				error(from, 'Error removing "'+channel.name+'"', err);
			} else {
				bot.say(from, 'Channel "'+channel.name+'"  unregistered!');
			}
		});
	},
	'^plugin (\\S+) (\\S+)': function(from, matches) {
		var channel = getChannel(matches[1], from);
		if (!channel) return;
		var found = channel.plugins.indexOf(matches[2]);
		if (!!~found)
			return bot.say(from, 'Plugin "'+matches[2]+'" already installed.');
		channel.plugins.push(matches[2]);
		channel.markModified('plugins');
		channel.save(function(err){
			if (err) {
				return error(from, 'Error adding saving "'+matches[2]+'" to "'+channel.name+'"', err);
			}
			err = loadPatterns(channel);
			if (err.length)
				return bot.say(from, 'The following plugins failed to load and were removed: ' + err.join(', '));
			bot.say(from, 'Plugin "'+matches[2]+'" installed!');
		});
	},
	'^unplug (\\S+) (\\S+)': function(from, matches) {
		var channel = getChannel(matches[1], from);
		if (!channel) return;
		var found = channel.plugins.indexOf(matches[2]);
		if (!~found)
			return bot.say(from, 'Plugin "'+matches[2]+'" is not installed.');
		channel.plugins.splice(found, 1);
		channel.markModified('plugins');
		channel.save(function(err){
			if (err) 
				return error(from, 'Error saving "'+matches[1]+'"', err);
			loadPatterns(channel);
			bot.say(from, 'Plugin "'+matches[2]+'" uninstalled!');
		});
	}
} };


/**
 * Bot connected to server!
 */
bot.addListener("registered", function(message){
	// If a password is available, check for ghosts
	if (config.irc.password) bot.say('nickserv', 'ghost ' + config.irc.userName || config.irc.nick + ' ' + config.irc.password);
	// Confirm username is correct
	bot.send("NICK", config.irc.userName || config.irc.nick);
	if (config.owner && bot) {
		externalip(function(err, ip) {
			bot.say(config.owner, "Connected! IP:" + ip);
		});
	}

	Channel.find(function(err, data){
		data.forEach(function(channel){
			channels[channel.name] = channel;
			loadPatterns(channel);
			bot.join(channel.name);
		});
	});
});

/**
 * Administrative commands directly to bot.
 */
bot.addListener("pm", function(from, message) {
	callPatterns(adminPatterns, message, from);
});

/**
 * Message received in connected channel
 */
bot.addListener("message#", function(from, channelName, message) {
	if (from == config.irc.userName || from == config.irc.nick) return;
	channel = channels[channelName];
	if (channel.patterns)
		callPatterns(channel.patterns, message, from);
	else
		bot.say(config.owner, "Error: Channel '"+channelName+"' Patterns not found");
});

/**
 * Message received in connected channel
 * /
bot.addListener("join", function(channelName, who) {
	channel = channels[channelName];
	if (channel.patterns) {}
		// callPatterns(channel.patterns, message, from);
});

/**
 * Message received in connected channel
 * /
bot.addListener("part", function(channelName, who, reason) {
	channel = channels[channelName];
	if (channel.patterns)
		callPatterns(channel.patterns, message, from);
});

/*
 * Message received in connected channel
 * /
bot.addListener("kick", function(channelName, who, by, reason) {
	channel = channels[channelName];
	if (channel.patterns)
		// callPatterns(channel.patterns, message, from);
});

/**
 * Any IRC Error event
 */
bot.addListener("error", function(error) {
  console.log('error', error);
  if (config.owner && bot)
    bot.say(config.owner, "ERROR: "+error.args.join(' : '));
});

// Add logging to joins and parts
var join = bot.join;
bot.join = function(channel){
  if (config.debug)
    console.log('Joining "'+channel+'"...');
  return join.apply(bot, Array.prototype.slice.call(arguments));
};

var part = bot.part;
bot.part = function(channel){
  if (config.debug)
    console.log('Joining "'+channel+'"...');
  return part.apply(bot, Array.prototype.slice.call(arguments));
};


module.exports = bot;
