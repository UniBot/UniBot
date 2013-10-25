var express  = require('express');
var config   = require('./../config');

app = express();
app.configure(function(){
  app.use(express.static('public'));
});
app.listen(config.port);