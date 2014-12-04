var connect  = require('connect');
var rest     = require('connect-rest');
var Channel  = require('./Channel');
var version  = require('./../package.json').version;

app = connect() 
  .use(rest.rester())
  .use(app.static('public'));

rest.get('/version', function(req, res, next){
  res.send(version);
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
rest.get('/channels/:channel/:plugin', function(req, res, next){
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

rest.get('/plugins/:plugin', function(req, res, next){
  res.render('');
});

module.exports = app;