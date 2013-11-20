/**
 * UniBot
 * An IRC bot for any channel on irc.freenode.net
 * @license MIT
 */


config = require('./config');

require('./lib/bot');

webserver = require('./lib/webserver');
webserver.listen(config.port);
