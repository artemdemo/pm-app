'use strict';

const boom = require('boom');
const projects = require('../models/projects');

exports.index = (request, reply) => reply('This is "projects" index route');

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
