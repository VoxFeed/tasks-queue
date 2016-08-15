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

module.exports = (channel) => {
  return (type, processor, concurrency) => {
    const tasksAtTime = concurrency || DEFAULT_CONCURRENCY;
    const queueOptions = {durable: true};
    const consumeOptions = {noAck: false};
    channel.assertQueue(type, queueOptions);
    channel.prefetch(tasksAtTime);
    return channel.consume(type, buildProcessor(channel, processor), consumeOptions);
  };
};
