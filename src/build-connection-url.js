const url = require('url');
const DEFAULT_PROTOCOL = 'amqp';
const DEFAULT_HOST = 'localhost';
const DEFAULT_PATH = null;

const buildConnectionUrl = (config) => {
  const {host = '', protocol, port, user, password, path} = config || {};
  const parsedUrl = Object.assign({}, url.parse(''));
  parsedUrl.slashes = true;
  parsedUrl.host = null;
  parsedUrl.path = null;
  parsedUrl.hostname = host || DEFAULT_HOST;
  parsedUrl.pathname = path || DEFAULT_PATH;
  parsedUrl.protocol = protocol || DEFAULT_PROTOCOL;
  if (user && password) parsedUrl.auth = `${user}:${password}`;
  if (port) parsedUrl.port = port;
  return url.format(parsedUrl);
};

module.exports = buildConnectionUrl;
