const boom = require('boom');
const projects = require('../models/projects');
const projectsTasksRelations = require('../models/projects_tasks_relations');
const errConstants = require('../constants/error');

// exports.index = (request, reply) => {
//     reply.redirect('/');
// };

exports.index = (request, reply) => reply.file('index.html');

exports.all = (request, reply) => {
    projects.getAll().then((projects) => {
        reply(projects);
    }, () => {
        reply(boom.badRequest('DB error'));
    });
};

exports.add = (request, reply) => {
    projects.addNew(request.payload).then((result) => {
        reply(result);
    }, () => {
        reply(boom.badRequest('DB error'));
    });
};

exports.update = (request, reply) => {
    const tasks = request.payload.tasks;
    const projectId = request.payload.id;
    projects.updateProject(request.payload).then((updatedData) => {
        if (tasks && projectId) {
            projectsTasksRelations.addRelation(projectId, tasks)
                .then(() => {
                    reply(updatedData);
                }, () => {
                    reply(boom.badRequest(errConstants.DB_ERROR));
                });
        } else {
            reply(updatedData);
        }
    }, () => {
        reply(boom.badRequest('DB error'));
    });
};

exports.delete = (request, reply) => {
    projects.deleteProject(request.params.projectId).then(() => {
        reply({});
    }, () => {
        reply(boom.badRequest('DB error'));
    });
};

exports.connectTask = (request, reply) => {
    projectsTasksRelations.addRelation(request.params.projectId, request.params.taskId)
        .then(() => {
            reply({});
        }, () => {
            reply(boom.badRequest('DB error'));
        });
};

exports.disconnectTask = (request, reply) => {
    projectsTasksRelations.deleteRelation(request.params.projectId, request.params.taskId)
        .then(() => {
            reply({});
        }, () => {
            reply(boom.badRequest('DB error'));
        });
};
