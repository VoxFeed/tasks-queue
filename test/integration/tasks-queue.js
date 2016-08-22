const taskQueueCreator = require('src/index');
const rabbitmqConfig = {host: 'localhost'};
const TASK_TYPE = 'test-task';

let executions = 0;

describe('Task Queue', () => {
  const taskQueueConfig = {rabbitmq: rabbitmqConfig};
  let taskQueue;

  beforeEach(done => {
    executions = 0;
    taskQueueCreator.connect(taskQueueConfig)
      .then(client => taskQueue = client)
      .then(() => taskQueue.clearQueue(TASK_TYPE))
      .then(() => done())
      .catch(done);
  });

  afterEach(done => {
    taskQueue.close()
      .then(() => done())
      .catch(done);
  });

  it('should send a task (using callbacks)', (done) => {
    taskQueue.send(TASK_TYPE, {timeout: 0}, done);
  });

  it('should send a task (using promises)', (done) => {
    const taskData = {timeout: 10};
    taskQueue.send(TASK_TYPE, taskData)
      .then(() => done())
      .catch(done);
  });

  it('should send a task and execute it', (done) => {
    const options = {
      type: TASK_TYPE
    };
    taskQueue.process(options, (data) => {
      const {timeout} = data;
      executions += 1;
      expect(data).to.be.an('object');
      return new Promise(resolve => {
        setTimeout(resolve, timeout);
      });
    });

    taskQueue.send(TASK_TYPE, {timeout: 0});

    setTimeout(() => {
      expect(executions).to.be.equal(1);
      done();
    }, 100);
  });

  it('should multiple tasks and execute them', (done) => {
    const options = {
      type: TASK_TYPE
    };
    taskQueue.process(options, (data) => {
      const {timeout} = data;
      executions += 1;
      expect(data).to.be.an('object');
      return new Promise(resolve => {
        setTimeout(resolve, timeout);
      });
    });

    taskQueue.send(TASK_TYPE, {timeout: 0, id: 1});
    taskQueue.send(TASK_TYPE, {timeout: 0, id: 2});

    setTimeout(() => {
      expect(executions).to.be.equal(2);
      done();
    }, 100);
  });

  it('should execute processors with concurrency equal 1', (done) => {
    const options = {
      type: TASK_TYPE,
      concurrency: 1
    };
    taskQueue.process(options, (data) => {
      const {timeout} = data;
      executions += 1;
      expect(data).to.be.an('object');
      return new Promise(resolve => {
        setTimeout(resolve, timeout);
      });
    });

    taskQueue.send(TASK_TYPE, {timeout: 100, id: 1});
    taskQueue.send(TASK_TYPE, {timeout: 100, id: 2});
    taskQueue.send(TASK_TYPE, {timeout: 100, id: 3});
    taskQueue.send(TASK_TYPE, {timeout: 100, id: 4});
    taskQueue.send(TASK_TYPE, {timeout: 100, id: 5});

    setTimeout(() => {
      const finished = executions === 5;
      expect(finished).to.be.equal(false);
      done();
    }, 300);
  });

  it('should execute processors with concurrency equal 5', (done) => {
    const options = {
      type: TASK_TYPE,
      concurrency: 5
    };
    taskQueue.process(options, (data) => {
      const {timeout} = data;
      executions += 1;
      expect(data).to.be.an('object');
      return new Promise(resolve => {
        setTimeout(resolve, timeout);
      });
    });

    taskQueue.send(TASK_TYPE, {timeout: 100, id: 1});
    taskQueue.send(TASK_TYPE, {timeout: 100, id: 2});
    taskQueue.send(TASK_TYPE, {timeout: 100, id: 3});
    taskQueue.send(TASK_TYPE, {timeout: 100, id: 4});
    taskQueue.send(TASK_TYPE, {timeout: 100, id: 5});

    setTimeout(() => {
      const finished = executions === 5;
      expect(finished).to.be.equal(true);
      done();
    }, 300);
  });
});

describe('Task Queue with prefix', () => {
  const taskQueueConfig = {prefix: 'test', rabbitmq: rabbitmqConfig};
  let taskQueue;

  beforeEach(done => {
    executions = 0;
    taskQueueCreator.connect(taskQueueConfig)
      .then(client => taskQueue = client)
      .then(() => taskQueue.clearQueue(TASK_TYPE))
      .then(() => done())
      .catch(done);
  });

  afterEach(done => {
    taskQueue.close()
      .then(() => done())
      .catch(done);
  });

  it('should send a task and execute it', (done) => {
    const options = {
      type: TASK_TYPE,
      concurrency: 5
    };
    taskQueue.process(options, (data) => {
      const {timeout} = data;
      executions += 1;
      expect(data).to.be.an('object');
      return new Promise(resolve => {
        setTimeout(resolve, timeout);
      });
    });

    taskQueue.send(TASK_TYPE, {timeout: 0});

    setTimeout(() => {
      expect(executions).to.be.equal(1);
      done();
    }, 100);
  });
});
