'use strict';

const boom = require('boom');
const projects = require('../models/projects');
const projectsTasksRelations = require('../models/projects_tasks_relations');

exports.index = (request, reply) => {
    reply.redirect('/');
};

exports.all = (request, reply) => {
    projects.getAll().then((projects) => {
        reply(projects);
    }, () => {
        reply(boom.badRequest('DB error'))
    });
};

exports.add = (request, reply) => {
    projects.addNew(request.payload).then((result) => {
        reply(result);
    }, () => {
        reply(boom.badRequest('DB error'))
    });
};

exports.update = (request, reply) => {
    projects.updateProject(request.payload).then(() => {
        reply({});
    }, () => {
        reply(boom.badRequest('DB error'))
    });
};

exports.delete = (request, reply) => {
    projects.deleteProject(request.params.projectId).then(() => {
        reply({});
    }, () => {
        reply(boom.badRequest('DB error'))
    });
};

exports.connectTask = (request, reply) => {
    projectsTasksRelations.addRelation(request.params.projectId, request.params.taskId)
        .then(() => {
            reply({});
        }, () => {
            reply(boom.badRequest('DB error'))
        })
}

exports.disconnectTask = (request, reply) => {
    projectsTasksRelations.deleteRelation(request.params.projectId, request.params.taskId)
        .then(() => {
            reply({});
        }, () => {
            reply(boom.badRequest('DB error'))
        })
}
