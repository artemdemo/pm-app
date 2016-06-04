'use strict';

const boom = require('boom');
const tasks = require('../models/tasks');
const projectsTasksRelations = require('../models/projects_tasks_relations');

exports.index = (request, reply) => {
    reply.redirect('/');
};

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

exports.connectProject = (request, reply) => {
    projectsTasksRelations.addRelation(request.params.projectId, request.params.taskId)
        .then(() => {
            reply({});
        }, () => {
            reply(boom.badRequest('DB error'))
        })
};

exports.disconnectProject = (request, reply) => {
    projectsTasksRelations.deleteRelation(request.params.projectId, request.params.taskId)
        .then(() => {
            reply({});
        }, () => {
            reply(boom.badRequest('DB error'))
        })
};
