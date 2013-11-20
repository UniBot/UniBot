var express  = require('express');
var config   = require('./../config');
var storage  = require('./storage');
var package  = require('./../package.json');

app = express();
app.configure(function(){
  app.use(express.static('public'));
});

app.get('/version', function(req, res, next){
  res.send(package.version);
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
app.get('/plugins/:plugin/:channel', function(req, res, next){
  var plugin;
  try {
  	plugin = require('./plugins/'+req.params.plugin);
  } catch(e) {
  	return res.send(404, 'Plugin not found');
  }
  if (!plugin.model) return res.send(400, 'Plugin does not have a model');
  require('./plugins/'+req.params.plugin).model.findOne({channel:req.params.channel}, function(err, channel){
    res.send(err || channel);
  });
});

module.exports = app;