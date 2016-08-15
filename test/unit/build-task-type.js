const buildTaskType = require('src/build-task-type');

describe('Build Task Type', () => {
  it('should omit prefix if empty', () => {
    const EXPECTED_RESULT = 'type';
    const prefix = '';
    const type = 'type';
    const taskType = buildTaskType(prefix, type);
    expect(taskType).to.be.equal(EXPECTED_RESULT);
  });

  it('should omit prefix if null', () => {
    const EXPECTED_RESULT = 'type';
    const prefix = null;
    const type = 'type';
    const taskType = buildTaskType(prefix, type);
    expect(taskType).to.be.equal(EXPECTED_RESULT);
  });

  it('should omit prefix if undefined', () => {
    const EXPECTED_RESULT = 'type';
    const prefix = undefined;
    const type = 'type';
    const taskType = buildTaskType(prefix, type);
    expect(taskType).to.be.equal(EXPECTED_RESULT);
  });

  it('should add prefix to type', () => {
    const EXPECTED_RESULT = 'q:type';
    const prefix = 'q';
    const type = 'type';
    const taskType = buildTaskType(prefix, type);
    expect(taskType).to.be.equal(EXPECTED_RESULT);
  });
});
