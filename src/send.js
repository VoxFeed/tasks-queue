const nodeify = require('nodeify');

const parseTaskData = data => new Buffer(JSON.stringify(data || ''));

const storeTask = (channel, type, data) => {
  const queueOptions = {durable: true};
  const taskOptions = {persistent: true};
  const content = parseTaskData(data);
  channel.assertQueue(type, queueOptions);
  channel.sendToQueue(type, content, taskOptions);
  return channel.waitForConfirms();
};

module.exports = (channel) => {
  return (type, data, callback) => nodeify(storeTask(channel, type, data), callback);
};
