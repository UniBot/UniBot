/**
 * UniBot
 * An IRC bot for any channel on irc.freenode.net
 * @license MIT
 */


config = require('./config');

require('mongoose').connect(config.mongo);

require('./lib/bot');

require('./lib/webserver').listen(config.port, config.ip);
