const nodeify = require('nodeify');

module.exports = (channel) => {
  return (type, callback) => nodeify(channel.purgeQueue(type), callback);
};
