/**
 * Default app for nodester
 * @license MIT
*/

/*jshint node:true, noempty:true, laxcomma:true, laxbreak:false */


"use strict";

var fs = require('fs')
  , express = require('express')
  , app = express.createServer()
  ;

app.configure(function(){
	app.use(express.static(__dirname+'/public'));	
})


app.get('/', function(req,res){
	fs.createReadStream(__dirname + '/index.html').pipe(res);
});

app.get('/version', function(req,res){
	res.writeHeader(200, {'Content-type':'application/json'});
	res.end('{"version":"'+ process.version +'"}');
})

app.get('*', function(req,res){
	res.statusCode = 404;
	res.end(':: not found ::');
});

app.listen(process.env['app_port'] || 3000 , function(){
	console.log(':: nodester :: \n\nApp listening on port %s', this.address().port)
});