var express  = require('express');
var config   = require('./../config');
var storage  = require('./storage');

app = express();
app.configure(function(){
  app.use(express.static('public'));
});

app.get('/channels', function(req, res, next){
  storage.model.find({}, function(err, channels){
    res.send(err || channels);
  });
});
app.get('/channels/:channel', function(req, res, next){
  storage.model.findById(req.params.channel, function(err, channel){
    res.send(err || channel);
  });
});

module.exports = app;