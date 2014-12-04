var config   = require('./../config');
var Channel  = require('./Channel');
var bot      = require('./irc');
var _        = require('lodash');
var dns      = require('dns');
var os       = require('os');

var channels = {};

/**
 * Iterates through a patterns object and calls the corresponding callback if it match
 * @param patterns {hash{String:Function}} "PatternString":callback(from, matches)
 * @param message {String} Message to check patterns against
 */
function callPatterns(patterns, message, from) {
	_.each(patterns, function(callback, pattern){
		expression = new RegExp(pattern, 'i');
		var matches = expression.exec(message);
		if (matches) {
			callback(from, matches);
		}
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
 * Adding as property of module so that `bot.js` can use it
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
		try {
			plugin = require('./plugins/'+plugin);
			_.extend(channel.patterns, plugin(channel, config));
		} catch (e) {
			channel.plugins.splice(i, 1);
			errors.push('[' + plugin + '] - ' + e);
		}
	});

	// Remove broken plugins
	if (errors.length) {
		channel.markModified('plugins');
		channel.save();
	}
	return errors;
}

var adminPatterns = {
	'^register (\\S+)': function(from, matches) {
		var name = formatName(matches[1]);
		if (channels[name]) {
			return bot.say(from, 'Channel "'+name+'" already registered.');
		}

		bot.join(name, function(){
			var channel = new channel({
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
		channel.remove(function(err, channel){
			if (err) {
				error(from, 'Error removing "'+channel.name+'"', err);
			} else {
				bot.say(from, 'Channel "'+channel.name+'"  unregistered!');
			}
		});
	},
	'^plugin (\\S+) (\\S+)': function(from, matches) {
		var channel =  = getChannel(matches[1], from);
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
};


/**
 * Bot connected to server!
 */
bot.addListener("registered", function(message){
	if (config.owner && bot) {
		dns.lookup(os.hostname(), function (err, ip, fam) {
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
	channel = channels[channelName];
	if (channel.patterns)
		callPatterns(channel.patterns, message, from);
	else
		bot.say(config.owner, "Error: Channel '"+channelName+"' Patterns not found");
});

module.exports = bot;
