const boom = require('boom');
const tasks = require('../models/tasks');
const projectsTasksRelations = require('../models/projects_tasks_relations');
const auth = require('../auth');
const errConstants = require('../constants/error');

// exports.index = (request, reply) => {
//     reply.redirect('/');
// };

exports.index = (request, reply) => reply.file('index.html');

exports.all = (request, reply) => {
    const tokenData = auth.parseTokenData(request.headers.authorization);
    if (!tokenData) {
        reply(boom.unauthorized(errConstants.NO_ID_IN_TOKEN));
        return;
    }
    const tasksData = {
        tokenId: tokenData.id,
    };
    tasks.getAll(tasksData).then((tasks) => {
        reply(tasks);
    }, () => {
        reply(boom.badRequest(errConstants.DB_ERROR));
    });
};

exports.add = (request, reply) => {
    const tokenData = auth.parseTokenData(request.headers.authorization);
    if (!tokenData) {
        reply(boom.unauthorized(errConstants.NO_ID_IN_TOKEN));
        return;
    }
    const tasksData = {
        payload: request.payload,
        tokenId: tokenData.id,
    };
    tasks.addNew(tasksData).then((result) => {
        reply(result);
    }, () => {
        reply(boom.badRequest(errConstants.DB_ERROR));
    });
};

exports.update = (request, reply) => {
    const tokenData = auth.parseTokenData(request.headers.authorization);
    const projects = request.payload.projects;
    const taskId = request.payload.id;
    if (!tokenData) {
        reply(boom.unauthorized(errConstants.NO_ID_IN_TOKEN));
        return;
    }
    const tasksData = {
        payload: request.payload,
        tokenId: tokenData.id,
    };
    tasks.updateTask(tasksData).then((updatedData) => {
        if (taskId && projects) {
            projectsTasksRelations.addRelation(projects, taskId)
                .then(() => {
                    reply(updatedData);
                }, () => {
                    reply(boom.badRequest(errConstants.DB_ERROR));
                });
        } else {
            reply(updatedData);
        }
    }, () => {
        reply(boom.badRequest(errConstants.DB_ERROR));
    });
};

exports.delete = (request, reply) => {
    const tokenData = auth.parseTokenData(request.headers.authorization);
    if (!tokenData) {
        reply(boom.unauthorized(errConstants.NO_ID_IN_TOKEN));
        return;
    }
    const tasksData = {
        payload: request.params.taskId,
        tokenId: tokenData.id,
    };
    tasks.deleteTask(tasksData).then(() => {
        reply({});
    }, () => {
        reply(boom.badRequest(errConstants.DB_ERROR));
    });
};

exports.connectProject = (request, reply) => {
    projectsTasksRelations.addRelation(request.params.projectId, request.params.taskId)
        .then(() => {
            reply({});
        }, () => {
            reply(boom.badRequest(errConstants.DB_ERROR));
        });
};

exports.disconnectProject = (request, reply) => {
    projectsTasksRelations.deleteRelation(request.params.projectId, request.params.taskId)
        .then(() => {
            reply({});
        }, () => {
            reply(boom.badRequest(errConstants.DB_ERROR));
        });
};
