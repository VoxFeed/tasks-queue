const DEFAULT_CONCURRENCY = 1;

const buildProcessor = (channel, processor) => {
  return (message) => {
    const taskData = parseMessage(message);
    processor(taskData, () => channel.ack(message));
  }
};

const parseMessage = message => JSON.parse(message.content.toString('utf-8'));

module.exports = (channel) => {
  return (type, processor, concurrency) => {
    const tasksAtTime = concurrency || DEFAULT_CONCURRENCY;
    const queueOptions = {durable: true};
    const consumeOptions = {noAck: false};
    channel.assertQueue(type, queueOptions);
    channel.prefetch(tasksAtTime);
    channel.consume(type, buildProcessor(channel, processor), consumeOptions);
  };
};
