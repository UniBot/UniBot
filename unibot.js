/**
 * ui-bot
 * An IRC bot for irc.freenode.net/angularjs
 * @license MIT
 */

// requires node's http module
var http     = require('http');
var express  = require('express');
var config   = require('./config');


/*
// Cache of active commands
var cmdList = {},
    logList = {},
    sawList = {};

jerk( function( j ) {

  // Load all commands from Mongo
  models.command.find({}, function(err, docs){
    var length = docs.length;
    if (length) {
      docs.forEach(function(cmd){
        cmdList[cmd.key] = cmd.value;
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
  j.watch_for( /!seen (\S+)/i , function( message ) {
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


// Webserver
//
app = express();
app.configure(function(){
  app.use(express.static('public'));
});
app.get('/commands', function(req, res, next){
  res.send(cmdList);
});
app.post('/commands', function(req, res, next){
  var key = req.body.key;
    key = key.toLowerCase();
    var cmd = new models.command({ key: key, value: req.body.value });
    if (cmdList[cmd.key]) {
      res.end(409);
    }
    cmd.save(function(err) {
      cmdList[cmd.key] = cmd.value;
      res.end(201);
    });
});
app.delete('/commands/:key', function(req, res, next){
  var key = req.params.key;
  key = key.toLowerCase();
  models.command.remove({ key: key }, function(err) {
    delete cmdList[key];
    res.end(204);
  });
});
app.get('/logs', function(req, res, next){
  res.send(logList);
});
app.get('/seen', function(req, res, next){
  res.send(sawList);
});



/* First, lets create an IRC Client.
 * The quickest way is to use the laziness function `irc.connect()`.
 * It takes an object configuring the bot, and returns a Client instance.
 */

var irc = require("irc");
var commands = require("./lib/commands");

var bot = new irc.Client(config.server, config.irc.userName, config.irc);

commands.bot = bot;

bot.addListener("pm", function(from, message) {
  var params = message.split(' ');
  if (params.length > 1 && commands.pm[params[0]]) {
    commands.pm[params[0]](from, params);
  }
});

bot.addListener("message#", function(from, channel, message) {
  var params = message.split(' ');
  if (commands.pm[params[0]]) {
    commands.message[params[0]](from, channel, params);
  } else if (commands.channels[channel].commands[params[0]]) {
    commands.say[params[0]](from, channel, params);
  }
});

bot.addListener("error", function() {
  console.log('error', arguments);
});

// app.listen(config.port);