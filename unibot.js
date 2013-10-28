/**
 * UniBot
 * An IRC bot for any channel on irc.freenode.net
 * @license MIT
 */


config = require('./config');

require('./lib/bot');

// @TODO Refactor approach of adding plugin routes to webserver
require('./lib/plugins/commands');
require('./lib/plugins/karma');
require('./lib/plugins/logs');

webserver = require('./lib/webserver');
webserver.listen(config.port);
