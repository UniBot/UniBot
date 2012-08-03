# IRC Bot for #AngularJS

### Notes

1. Please don't abuse the mongoDB credentials. I'm too lazy to hide them.
2. Only ProLoser can deploy the IRC bot to Nodejitsu. Currently, Nodejitsu's IP is banned from freenode, so until it is unbanned (should be soon), it must be run locally
3. Nodejitsu expects a webserver to run, that is the only purpose for it at the bottom.
4. We may re-use this project for also hosting/building the website on its own server

## Development

1. Customize the `options` variable (you may want to turn logging on)
2. `npm install`
3. `node server.js`