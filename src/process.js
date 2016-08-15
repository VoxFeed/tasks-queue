const buildTaskType = require('./build-task-type');
const DEFAULT_CONCURRENCY = 1;

const buildProcessor = (channel, processor) => {
  return (message) => {
    const taskData = parseMessage(message);
    processor(taskData, (error) => {
      try {
        if (error) return channel.nack(message);
        channel.ack(message);
      } catch (e) {}
    });
  }
};

const parseMessage = message => JSON.parse(message.content.toString('utf-8'));

module.exports = (channel, config) => {
  const {prefix} = config || {};

  return (type, processor, concurrency) => {
    const tasksAtTime = concurrency || DEFAULT_CONCURRENCY;
    const queueOptions = {durable: true};
    const consumeOptions = {noAck: false};
    const taskType = buildTaskType(prefix, type);
    channel.assertQueue(taskType, queueOptions);
    channel.prefetch(tasksAtTime);
    return channel.consume(taskType, buildProcessor(channel, processor), consumeOptions);
  };
};
