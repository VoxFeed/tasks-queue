# Tasks Queue

This module is an abstraction of [RabbitMQ](https://www.rabbitmq.com).

It supports both promises and callbacks.

## Install

`npm install --save vf-tasks-queue`


## API

### TaskQueueLib.connect(options, [callback])

Returns a task queue, ready to send and process tasks.

**Parameters**

* *options* (Object): Tasks queue configuration
	* *rabbitmq* (Object): Configuration to connect to RabbitMQ server.
        * *host* (String): Server host.
        * *port* (String): Server port.
        * *user* (String): Server user.
        * *password* (String): Server password.


### tasksQueue.send(type, data, [callback])

Stores a new task in the queue.

**Parameters**

* *type* (String): Task type, this is used to match task processors.
* *data* (Object): An data object that will be sent to processor when takes this task.


### tasksQueue.process(type, processor, [concurrency])

Takes tasks and process them.

**Parameters**

* *type* (String): Task type, this is used to fetch only this type of tasks.
* *processor* (Function): A function that will process a task. This function will receive 2 parameters: `data` and `callback`. `callback` must be executed when task is done, otherwise task won't be marked as resolved and will be processed again.
* *concurrency* (Integer): An integer that indicates the number of tasks that can be processed at the same time. Defaults to `1`.


### tasksQueue.clearQueue(type, [callback])

Removes all unprocessed tasks of a type.

**Parameters**

* *type* (String): Task type, this is used to remove only this type of tasks.


### tasksQueue.close([callback])

Closes the connection with database.


## Example:

*config.js*
```javascript
module.exports = {
  rabbitmq: {
    host: 'localhost'
  }
};
```

*tasks_sender.js*
```javascript
const config = require('config.js');
const tasksQueueConnector = require('vf-tasks-queue');
const taskType = 'test-task';
const taskData = {
  name: 'Chewbacca'
};

tasksQueueConnector.connect(config)
  .then(tasksQueue => {
    tasksQueue.send(taskType, taskData)
  });
```

*tasks_processor.js*
```javascript
const config = require('config.js');
const tasksQueueConnector = require('vf-tasks-queue');
const taskType = 'test-task';

const processor = (data, callback) => {
  console.log(data.name); // Prints “Chewbacca”
  callback();
}

tasksQueueConnector.connect(config)
  .then(tasksQueue => {
    tasksQueue.process(taskType, processor, 1)
  });
```

## Tests

`npm test`


## License

MIT
