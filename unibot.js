/**
 * UniBot
 * An IRC bot for any channel on irc.freenode.net
 * @license MIT
 */

var package  = require('./package.json');

var config = require('./config');

var db = require('mongoose').connect(config.mongo);

var web = require('./lib/webserver').listen(config.port, config.ip);

var bot = require('./lib/bot');

var prefix = 'unibot-';

var name, plugin;

for (var dependency in package.dependencies) {
	if (dependency.substr(0, prefix.length) == prefix) {
		name = dependency.substr(prefix.length);
		plugin = require(dependency)({ db: db, web: web, bot: bot, config: config });
		bot.addPlugin( name , plugin );
	}
}