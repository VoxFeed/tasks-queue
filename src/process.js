const buildTaskType = require('./build-task-type');
const DEFAULT_CONCURRENCY = 1;

const buildProcessor = (channel, processor) => {
  return (message) => {
    const taskData = parseMessage(message);
    processor(taskData)
      .then(() => channel.ack(message))
      .catch(error => channel.nack(message));
    }
};

const parseMessage = message => JSON.parse(message.content.toString('utf-8'));

module.exports = (channel, config) => {
  const {prefix} = config || {};

  return (options, processor) => {
    const {type, concurrency = DEFAULT_CONCURRENCY} = options;
    const queueOptions = {durable: true};
    const consumeOptions = {noAck: false};
    const taskType = buildTaskType(prefix, type);
    channel.assertQueue(taskType, queueOptions);
    channel.prefetch(concurrency);
    return channel.consume(taskType, buildProcessor(channel, processor), consumeOptions);
  };
};
