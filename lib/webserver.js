var express  = require('express');
var Channel  = require('./Channel');
var package  = require('../package.json');
var _        = require('lodash');

var app = express();

app.use(express.static('../public'));

app.get('/version', function(req, res, next){
  res.send(package.version);
});
app.get('/channels', function(req, res, next){
  Channel.find({}, function(err, channels){
    res.send(err || channels);
  });
});
app.get('/channels/:channel', function(req, res, next){
  Channel.findById(req.params.channel, function(err, channel){
    res.send(err || channel);
  });
});

module.exports = app;