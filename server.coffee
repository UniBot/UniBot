http = require "http"
http.createServer (req, res) ->
  res.writeHead 200,
    "Content-Type": "text/plain"
  res.end "Hello Zev\nApp (zevcoffee) is running on Node.JS " + process.version
.listen process.env["app_port"] or 18642
