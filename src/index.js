const amqp = require('amqplib');
const nodeify = require('nodeify');
const close = require('./close');
const send = require('./send');
const processTasks = require('./process');
const clearQueue = require('./clear-queue');
const buildConnectionUrl = require('./build-connection-url');

const createChannel = connection => connection.createConfirmChannel();

const getConnectionOptions = config => ((config || {}).rabbitmq || {}).options;

const connect = (config) => {
  let connection;

  const connectionUrl = buildConnectionUrl(config.rabbitmq);
  const connectionOptions = getConnectionOptions(config);

  const getConnection = () => {
    const connect = amqp.connect(connectionUrl, connectionOptions);
    return connect.then(conn => {
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
        send: send(channel, config),
        process: processTasks(channel, config),
        clearQueue: clearQueue(channel, config),
        close: close(connection)
      };
    });
};

const TaskQueue = {
  connect: (config, callback) => nodeify(connect(config), callback)
};

module.exports = TaskQueue;
