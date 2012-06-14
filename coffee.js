
var app = process.argv[2] || 'server'
  , path = require('path');

 if (path.existsSync(app)){
 	require('coffee-script');
 	require(path.resolve(app));
 } else {
 	console.log('not found',app);
 	process.kill(process.pid, 'SIGKILL')
 }

