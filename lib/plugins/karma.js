var storage   = require('./../storage');
var config    = require('./../../config');

var Karma = new storage.mongoose.Schema({
  channel : {
    type  : String, // channel._id
    index : {
      unique   : true,
      dropDups : false
    }
  },
  karma : {
    type: storage.mongoose.Schema.Types.Mixed,
    default: {}
  }
});

var model = storage.mongoose.model('Karma', Karma);

var plugin = function(channel){

  var karma,
      cooldown = {};

  model.findOne({ channel: channel.id }, function(err, _karma_){
    if (err || !_karma_) {
      karma = new model({
        channel: channel.id
      });
      karma.save();
    } else {
      karma = _karma_;
    }
  });

  function checkKarma(name) {
    if (!karma.karma[name])
      karma.karma[name] = 0;
  }

  function saveKarma(from, name) {
    cooldown[from] = setTimeout(function(){
      delete cooldown[from];
    }, 3600000); // 1 hour

    karma.markModified('karma');
    karma.save(function(err){
      if (!err)
        sayKarma(name);
    });
  }
  function sayKarma(name) {
    channel.say(name + ' Karma: ' + karma.karma[name]);
  }

  return {
    "^(\\S+)\\+\\+$": function(from, matches) {
      if (from == matches[1]) return;
      if (cooldown[from]) return channel.say(from + ': you must wait an hour between giving karma');
      checkKarma(matches[1]);
      karma.karma[matches[1]]++;
      saveKarma(from, matches[1]);
    },
    "^(\\S+)\\-\\-$": function(from, matches) {
      if (from == matches[1]) return;
      if (cooldown[from]) return channel.say(from + ': you must wait an hour between giving karma');
      checkKarma(matches[1]);
      karma.karma[matches[1]]--;
      saveKarma(from, matches[1]);
    },
    "^!karma(?: (\\S+))?$": function(from, matches) {
      if (matches[1]) from = matches[1];
      checkKarma(from);
      sayKarma(from);
    }
  };
};

plugin.model = model;

module.exports = plugin;