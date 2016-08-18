const buildConnectionUrl = require('src/build-connection-url');

describe('Build Connection Url', () => {
  it('should return default url', (done) => {
    const EXPECTED_CONNECTION_URL = 'amqp://localhost';
    const config = null;
    const connectionUrl = buildConnectionUrl(config);
    expect(connectionUrl).to.be.equal(EXPECTED_CONNECTION_URL);
    done();
  });

  it('should return the same uri', (done) => {
    const EXPECTED_CONNECTION_URL = 'amqp://localhost';
    const config = {
      host: 'localhost'
    };
    const connectionUrl = buildConnectionUrl(config);
    expect(connectionUrl).to.be.equal(EXPECTED_CONNECTION_URL);
    done();
  });

  it('should add user and password to uri', (done) => {
    const EXPECTED_CONNECTION_URL = 'amqp://myuser:mypass@localhost';
    const config = {
      host: 'localhost',
      user: 'myuser',
      password: 'mypass'
    };
    const connectionUrl = buildConnectionUrl(config);
    expect(connectionUrl).to.be.equal(EXPECTED_CONNECTION_URL);
    done();
  });

  it('should work fine with port', (done) => {
    const EXPECTED_CONNECTION_URL = 'amqp://myuser:mypass@localhost:5672';
    const config = {
      host: 'localhost',
      port: 5672,
      user: 'myuser',
      password: 'mypass'
    };
    const connectionUrl = buildConnectionUrl(config);
    expect(connectionUrl).to.be.equal(EXPECTED_CONNECTION_URL);
    done();
  });

  it('should override host', (done) => {
    const EXPECTED_CONNECTION_URL = 'amqp://myuser:mypass@54.88.46.172:5672';
    const config = {
      host: '54.88.46.172',
      port: 5672,
      user: 'myuser',
      password: 'mypass'
    };
    const connectionUrl = buildConnectionUrl(config);
    expect(connectionUrl).to.be.equal(EXPECTED_CONNECTION_URL);
    done();
  });

  it('should support amqps protocol', (done) => {
    const EXPECTED_CONNECTION_URL = 'amqps://myuser:mypass@54.88.46.172:5672';
    const config = {
      host: '54.88.46.172',
      protocol: 'amqps',
      port: 5672,
      user: 'myuser',
      password: 'mypass'
    };
    const connectionUrl = buildConnectionUrl(config);
    expect(connectionUrl).to.be.equal(EXPECTED_CONNECTION_URL);
    done();
  });

    it('should support path', (done) => {
    const EXPECTED_CONNECTION_URL = 'amqp://localhost/my-queue';
    const config = {
      path: 'my-queue'
    };
    const connectionUrl = buildConnectionUrl(config);
    expect(connectionUrl).to.be.equal(EXPECTED_CONNECTION_URL);
    done();
  });
});
