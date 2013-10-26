var storage = require('./storage'),
    _       = require("lodash");

function Reply(user, channel, isPM) {
  this.user = user;
  this.channel = channel;
  this.isPM = isPM;
  this.bot = require('./bot');
}

/**
 * Send message in PM if responding to a privmsg, or to channel if responding to a channel
 * message.
 * @param message {string} Message to send
 * @param [recipient] {string} (Optional) Person to send message to
 */
Reply.prototype.reply = function(message, recipient) {
  if (this.isPM) {
    this.bot.say(this.user, message);
  } else if (this.channel) {
    this.channel.say(message, recipient);
  }
};

/**
 * Send message to channel if and only if a channel is available.
 * @param message {string} Message to send
 * @param [recipient] {string} (Optional) Person to send message to
 */
Reply.prototype.toChannel = function(message, recipient) {
  if (this.channel) {
    if (recipient && message.indexOf(recipient) === -1) {
      message = recipient + ": " + message;
    }
    this.channel.say(message);
  }
}

/**
 * Send message to user, even if responding to a channel message.
 * @param message {string} Message to send
 */
Reply.prototype.toUser = function(message) {
  this.bot.say(this.user, message);
}

module.exports = function(from, channel, isPM) {
  if (typeof isPM === 'object') {
    bot = isPM;
    isPM = false;
  }
  if (channel) {
    // Ensure channel is registered
    if (_.isString(channel) && _.isObject(storage.channels[channel])) {
      channel = storage.channels[channel];
    } else if (_.isObject(channel) && channel === storage.channels[channel.name]) {
      // NOOP
    } else {
      channel = undefined;
    }
  }
  return new Reply(from, channel, isPM);
}
