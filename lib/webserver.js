var connect  = require('connect');
var rest     = require('connect-rest');
var Channel  = require('./Channel');
var package  = require('../package.json');
var _        = require('lodash');

app = connect() 
  .use(rest.rester())
  .use(app.static('public'));

rest.get('/version', function(req, res, next){
  res.send(package.version);
});
rest.get('/channels', function(req, res, next){
  Channel.find({}, function(err, channels){
    res.send(err || channels);
  });
});
rest.get('/channels/:channel', function(req, res, next){
  Channel.findById(req.params.channel, function(err, channel){
    res.send(err || channel);
  });
});

var prefix = 'unibot-';
_.each(package.dependencies, function(version, dependency){
  if (dependency.substr(0, prefix.length) !== prefix) return;
  dependency = require(dependency);
  dependency.load && dependency.load(rest);
});

rest.get('/plugins/:plugin', function(req, res, next){
  res.send('');
});

module.exports = app;