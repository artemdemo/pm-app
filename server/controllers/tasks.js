const boom = require('boom');
const tasks = require('../models/tasks');

exports.index = (request, reply) => reply('This is "tasks" index route');

exports.all = (request, reply) => {
    tasks.getAll().then((tasks) => {
        reply(tasks);
    }, () => {
        reply(boom.badRequest('DB error'))
    });
};

exports.add = (request, reply) => {
    tasks.addNew(request.payload).then((result) => {
        reply(result);
    }, () => {
        reply(boom.badRequest('DB error'))
    });
};

exports.update = (request, reply) => {
    tasks.updateTask(request.payload).then(() => {
        reply({});
    }, () => {
        reply(boom.badRequest('DB error'))
    });
};

exports.delete = (request, reply) => {
    tasks.deleteTask(request.params.taskId).then(() => {
        reply({});
    }, () => {
        reply(boom.badRequest('DB error'))
    });
};