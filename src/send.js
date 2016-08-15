const nodeify = require('nodeify');

const parseTaskData = data => new Buffer(JSON.stringify(data || ''));

const handleCallback = (resolve, reject) => {
	return (error) => error ? reject(error) : resolve();
}

const storeTask = (channel, type, data) => {
  const queueOptions = {durable: true};
  const taskOptions = {persistent: true};
  const content = parseTaskData(data);
  channel.assertQueue(type, queueOptions);
  return new Promise((resolve, reject) => {
  	channel.sendToQueue(type, content, taskOptions, handleCallback(resolve, reject));
  });
};

module.exports = (channel) => {
  return (type, data, callback) => nodeify(storeTask(channel, type, data), callback);
};
