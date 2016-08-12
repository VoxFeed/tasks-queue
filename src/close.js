const nodeify = require('nodeify');

module.exports = (connection) => {
  return (callback) => nodeify(connection.close(), callback);
};
