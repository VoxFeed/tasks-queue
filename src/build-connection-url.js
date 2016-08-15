const url = require('url');
const DEFAULT_PROTOCOL = 'amqp:';
const DEFAULT_HOST = 'localhost';

const buildConnectionUrl = (config) => {
  const {host = '', port, user, password} = config || {};
  const parsedUrl = Object.assign({}, url.parse(''));
  parsedUrl.slashes = true;
  parsedUrl.host = null;
  parsedUrl.hostname = host || DEFAULT_HOST;
  parsedUrl.protocol = parsedUrl.protocol || DEFAULT_PROTOCOL;
  if (user && password) parsedUrl.auth = `${user}:${password}`;
  if (port) parsedUrl.port = port;
  return url.format(parsedUrl);
};

module.exports = buildConnectionUrl;
