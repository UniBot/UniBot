var models   = require('./models');

models.channel.find({}, function(err, rows){
  rows.forEach(function(channel){
    commands.channels[channel.name] = new models.channel(channel);
  });
});

var commands = {
	channels: {},
  bot: null,
  pm: {
  	'register': function(from, params) {
  	  commands.bot.join(params[1]);
  	  channels[params[1]] = new models.channel({ name: params[1] });
  	  channels[params[1]].save()
  	},
  	'unregister': function(from, params) {
  	  commands.bot.part(params[1]);
  	  commands.channels[params[1]].remove();
  	  delete commands.channels[params[1]];
  	},
  	'debug': function(from, params) {
  		console.log(channels[params[1]]);
  	}
  },
  message: {
  	'!remember': function(from, channel, params) {
  		if (!commands.channels[channel].commands)
  			commands.channels[channel].commands = {};
  		commands.channels[channel].commands[params[1]] = params.slice(2).join(' ');
  		commands.channels[channel].update();
  	},
  	'!forget': function(from, channel, params) {
  		delete commands.channels[channel].commands[params[1]];
  		commands.channels[channel].update();
  	}
  },
  say: function(from, channel, params) {
  	commands.bot.say(channel, commands.channels[channel].commands[params[0]]);
  }
};

module.exports = commands;