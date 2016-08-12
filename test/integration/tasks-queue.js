const taskQueueCreator = require('src/index');
const deleteQueue = require('test/scripts/delete-queue');
const taskQueueConfig = {rabbitmq: {uri: 'amqp://localhost'}};
const TASK_TYPE = 'test-task';

let executions = 0;

describe('Task Queue', () => {
  let taskQueue;

  beforeEach(done => {
    executions = 0;
    deleteQueue(taskQueueConfig, TASK_TYPE)
      .then(() => taskQueueCreator.create(taskQueueConfig))
      .then(client => taskQueue = client)
      .then(() => done())
      .catch(done);
  });

  afterEach(done => {
    taskQueue.close()
      .then(done)
      .catch(() => done());
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
    taskQueue.process(TASK_TYPE, (data, callback) => {
      const {timeout} = data;
      executions += 1;
      expect(data).to.be.an('object');
      setTimeout(callback, timeout);
    });

    taskQueue.send(TASK_TYPE, {timeout: 0});

    setTimeout(() => {
      expect(executions).to.be.equal(1);
      done();
    }, 100);
  });

  it('should multiple tasks and execute them', (done) => {
    taskQueue.process(TASK_TYPE, (data, callback) => {
      const {timeout} = data;
      executions += 1;
      expect(data).to.be.an('object');
      setTimeout(callback, timeout);
    });

    taskQueue.send(TASK_TYPE, {timeout: 0, id: 1});
    taskQueue.send(TASK_TYPE, {timeout: 0, id: 2});

    setTimeout(() => {
      expect(executions).to.be.equal(2);
      done();
    }, 100);
  });

  it('should execute processors with concurrency equal 1', (done) => {
    taskQueue.process(TASK_TYPE, (data, callback) => {
      const {timeout} = data;
      executions += 1;
      expect(data).to.be.an('object');
      setTimeout(callback, timeout);
    }, 1);

    taskQueue.send(TASK_TYPE, {timeout: 100, id: 1});
    taskQueue.send(TASK_TYPE, {timeout: 100, id: 2});
    taskQueue.send(TASK_TYPE, {timeout: 100, id: 3});
    taskQueue.send(TASK_TYPE, {timeout: 100, id: 4});
    taskQueue.send(TASK_TYPE, {timeout: 100, id: 5});

    setTimeout(() => {
      const finished = executions === 5;
      expect(finished).to.be.equal(false);
      setTimeout(done, 500);
    }, 300);
  });

  it('should execute processors with concurrency equal 5', (done) => {
    taskQueue.process(TASK_TYPE, (data, callback) => {
      const {timeout} = data;
      executions += 1;
      expect(data).to.be.an('object');
      setTimeout(callback, timeout);
    }, 5);

    taskQueue.send(TASK_TYPE, {timeout: 100, id: 1});
    taskQueue.send(TASK_TYPE, {timeout: 100, id: 2});
    taskQueue.send(TASK_TYPE, {timeout: 100, id: 3});
    taskQueue.send(TASK_TYPE, {timeout: 100, id: 4});
    taskQueue.send(TASK_TYPE, {timeout: 100, id: 5});

    setTimeout(() => {
      const finished = executions === 5;
      expect(finished).to.be.equal(true);
      setTimeout(done, 500);
    }, 300);
  });
});
