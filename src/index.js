const amqp = require('amqplib');
const nodeify = require('nodeify');
const close = require('./close');
const send = require('./send');
const process = require('./process');
const clearQueue = require('./clear-queue');
const buildConnectionUrl = require('./build-connection-url');

const createChannel = connection => connection.createConfirmChannel();

const create = (config) => {
  let connection;

  const connectionUrl = buildConnectionUrl(config.rabbitmq);

  const getConnection = () => {
    return amqp.connect(connectionUrl)
      .then(conn => {
        connection = conn;
        connection.on('close', () => {
          connection = undefined;
        });
        return connection;
      });
  };

  return getConnection()
    .then(createChannel)
    .then(channel => {
      return {
        send: send(channel),
        process: process(channel),
        clearQueue: clearQueue(channel),
        close: close(connection)
      };
    });
};

const TaskQueue = {
  create: (config, callback) => nodeify(create(config), callback)
};

module.exports = TaskQueue;
