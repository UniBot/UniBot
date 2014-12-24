var connect  = require('connect');
var rest     = require('connect-rest');
var static   = require('serve-static');
var Channel  = require('./Channel');
var package  = require('../package.json');
var _        = require('lodash');

app = connect()
  .use(rest.rester())
  .use(static('../public'));

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

module.exports = app;