/**
 * ui-bot
 * An IRC bot for irc.freenode.net/angularjs
 * @license MIT
 */

// requires node's http module
var http     = require('http');
var jerk     = require('jerk');
var models = require('./models');
var config   = require('./config');
var td       = require('./timeDifference');

jerk( function( j ) {
  // Cache of active commands
  var cmdList = {},
      logList = {},
      sawList = {};

  // Load all commands from Mongo
  models.command.find({}, function(err, docs){
    var length = docs.length;
    if (length) {
      console.log('found commands: ');
      docs.forEach(function(cmd){
        cmdList[cmd.key] = cmd.value;
        console.log(cmd.key + ' -> ' + cmdList[cmd.key]);
      });
    }
  });

  models.seen.find({}, function(err, docs){
    var length = docs.length;
    if (length) {
      docs.forEach(function(saw){
        sawList[saw.user] = {user:saw.user, time:saw.time, say:saw.say};
      });
    }
  });

  // when anything is said, we track it
  j.watch_for( /(.*)/gi, function ( message ) {
    var what = message.match_data,
        date = new Date();
    date = date.toString();
    var saw = new models.seen({user:message.user, time:date, say:what});
    var trk = new models.log({user:message.user, time:date, say:what});

    if (sawList[message.user]) {
      sawList[message.user] = {user:message.user, time:date, say:what};
      models.seen.find({user: message.user}).remove();
    }
    // keep a log
    trk.save(function(err){

    });

    // save in the seen db
    saw.save(function(err){
      sawList[message.user] = {user:message.user, time:date, say:what};
    });
  });

  // List all active commands
  j.watch_for( /^!list/i, function ( message ) {
    message.say( 'Existing Commands: ' + Object.keys(cmdList).sort().join(', ') );
  });

  // !seen optionalNick
  j.watch_for( /!seen (\S+)/i , function ( message ) {
    var saw = message.match_data[1];

    if (sawList[saw]) {
      var current = new Date();
      var old = new Date(sawList[saw].time);
      message.say(saw + ' was last seen at ' + td(current, old) + ' saying: ' + sawList[saw].say);
    } else {
      message.say('Sorry, I have not seen the user: ' + saw);
    }
  });

  // ![nonSpace] [optional arg] [@optionalNick]
  j.watch_for( /!(\S+)([^@]+)?(?:@(\S+))?/i , function ( message ) {
    var key = message.match_data[1];
    key = key.toLowerCase();
    var msg = cmdList[key];
    if (msg) {
      var user = message.user;
      // cutoff @ if @target is passed
      if (message.match_data[3])
        user = message.match_data[3];
      var arg = message.match_data[2] || '';
      // convert spaces in arg to + character
      if (arg) {
        arg = arg.trim().split(' ').join('+');
      }
      message.say( msg.split(':nick').join(user).split(':arg').join(arg) );
    }
  });

  // @[nick] meet met-bot
  j.watch_for( /@(\S+) ?(meet met-bot)/i , function ( message ) {
    console.log('0: ' + message.match_data[0]);
    console.log('1: ' + message.match_data[1]);
    var who = message.match_data[1];
    who = who.toLowerCase();

    var arg = message.match_data[2] || '';

    message.say( 'hello ' + who + ' ... nice pants' );
  });

  // !remember [nonSpace] id [value containing optional :nick and :arg]
  j.watch_for( /^!remember (\S+) is (.+)/i, function ( message ) {
    var key = message.match_data[1];
    key = key.toLowerCase();
    var cmd = new models.command({ key: key, value: message.match_data[2] });
    if (cmdList[cmd.key]) {
      message.say( message.user + ': "'+cmd.key+'" already exists');
      return;
    }
    cmd.save(function(err) {
      cmdList[cmd.key] = cmd.value;
      message.say( message.user + ': "' + cmd.key + '" has been saved' );
    });
  });

  // !forget [nonSpace]
  j.watch_for( /^!forget (\S+)/i, function ( message ) {
    var key = message.match_data[1];
    key = key.toLowerCase();
    models.command.remove({ key: key }, function(err) {
      delete cmdList[key];
      message.say( 'The "'+key+'" command has been removed' );
    });
  });

  // !show [nonSpace]
  j.watch_for( /^!show (\S+)/i, function ( message ) {
    var key = message.match_data[1];
    key = key.toLowerCase();
    message.say( key+' is "'+cmdList[key]+'"' );
  });
}).connect(config.irc);




// BELOW CODE IS JUST TO MAKE NODEJITSU HAPPY //

// creates a new httpServer instance
http.createServer(function (req, res) {
  // this is the callback, or request handler for the httpServer

  // respond to the browser, write some headers so the
  // browser knows what type of content we are sending
  res.writeHead(200, {'Content-Type': 'text/html'});

  // write some content to the browser that your user will see
  res.write('<h1>hello, i know nodejitsu.</h1>');

  // close the response
  res.end();
}).listen(config.port); // the server will listen on port 80
