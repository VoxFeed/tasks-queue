const nodeify = require('nodeify');
const buildTaskType = require('./build-task-type');

module.exports = (channel, config) => {
	const {prefix} = config || {};

	const clearQueue = (type) => {
	  const queueOptions = {durable: true};
	  const taskType = buildTaskType(prefix, type);
	  channel.assertQueue(taskType, queueOptions);
		return channel.purgeQueue(taskType);
	};

  return (type, callback) => nodeify(clearQueue(type), callback);
};
