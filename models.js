// Setup Mongo
mongoose.connect(config.mongo);
var Schema = mongoose.Schema;

var Command = new Schema({
  key   : String,
  value : String
});
var Log = new Schema({
  time : String,
  user : String,
  say  : String
});
var Seen = new Schema({
  time : String,
  user : {
    type : String,
    index : {
      unique : true,
      dropDups: false
    }
  },
  say  : String
});
var Channel = new Schema({
  channel  : {
    type  : String,
    index : {
      unique   : true,
      dropDups : false
    }
  },
  name     : String,
  realName : String,
  command : {
    key   : String,
    Value : String
  },
  log : {
    time : String,
    user : String,
    say  : String
  },
  seen : {
    time : String,
    user : {
      type : String,
      index: {
        unique   : true,
        dropDups : false
      }
    },
    say : String
  }
});

var models = {
  command: mongoose.model('Command', Command),
  log: mongoose.model('Log', Log),
  seen: mongoose.model('Seen', Seen)
};

module.exports = models;