const amqp = require('amqplib');
const nodeify = require('nodeify');
const close = require('./close');
const send = require('./send');
const process = require('./process');
const buildConnectionUrl = require('./build-connection-url');

const createChannel = connection => connection.createConfirmChannel();

const create = (config) => {
  const connectionUrl = buildConnectionUrl(config.rabbitmq);
  let connection;

  return amqp.connect(connectionUrl)
    .then(conn => {
      connection = conn;
      return createChannel(connection);
    })
    .then(channel => {
      return {
        send: send(channel),
        process: process(channel),
        close: close(connection)
      };
    });
};

const TaskQueue = {
  create: (config, callback) => nodeify(create(config), callback)
};

module.exports = TaskQueue;
