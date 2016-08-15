const nodeify = require('nodeify');

module.exports = (connection) => {
  const close = () => {
    if (!connection) return Promise.resolve();
    return connection.close();
  };
  return (callback) => nodeify(close(), callback);
};
