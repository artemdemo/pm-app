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
