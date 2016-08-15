const nodeify = require('nodeify');
const buildTaskType = require('./build-task-type');

const parseTaskData = data => new Buffer(JSON.stringify(data || ''));

const handleCallback = (resolve, reject) => {
	return (error) => error ? reject(error) : resolve();
};

module.exports = (channel, config) => {
	const {prefix} = config || {};

	const storeTask = (type, data) => {
	  const queueOptions = {durable: true};
	  const taskOptions = {persistent: true};
	  const content = parseTaskData(data);
	  const taskType = buildTaskType(prefix, type);
	  channel.assertQueue(taskType, queueOptions);
	  return new Promise((resolve, reject) => {
	  	channel.sendToQueue(taskType, content, taskOptions, handleCallback(resolve, reject));
	  });
	};

  return (type, data, callback) => nodeify(storeTask(type, data), callback);
};
