const amqp = require('amqplib');
const buildConnectionUrl = require('src/build-connection-url');

const deleteQueue = (config, queueName) => {
  const connectionUrl = buildConnectionUrl(config);
  return amqp.connect(connectionUrl)
    .then(connection => connection.createChannel())
    .then(channel => channel.purgeQueue(queueName));
};

module.exports = deleteQueue;
