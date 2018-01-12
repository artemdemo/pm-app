const debug = require('debug')('pm:controllers:task');
const boom = require('boom');
const tasks = require('../models/tasks');
const projectsTasksRelations = require('../models/projects_tasks_relations');
const auth = require('../auth');
const errConstants = require('../constants/error');

// exports.index = (request, replay) => {
//     replay.redirect('/');
// };

exports.index = (request, replay) => replay.file('index.html');

exports.all = (request, replay) => {
    const tokenData = auth.parseTokenData(request.headers.authorization);
    if (!tokenData) {
        replay(boom.unauthorized(errConstants.NO_ID_IN_TOKEN));
        return;
    }
    const tasksData = {
        tokenId: tokenData.id,
    };
    tasks.getAll(tasksData)
        .then((tasks) => {
            replay(tasks);
        })
        .catch((err) => {
            debug(err);
            replay(boom.badRequest(errConstants.DB_ERROR));
        });
};

exports.add = (request, replay) => {
    const tokenData = auth.parseTokenData(request.headers.authorization);
    const { projects } = request.payload;
    if (!tokenData) {
        replay(boom.unauthorized(errConstants.NO_ID_IN_TOKEN));
        return;
    }
    const tasksData = {
        payload: request.payload,
        tokenId: tokenData.id,
    };
    tasks.addNew(tasksData)
        .then((result) => {
            debug(`Task id ${result.id} created`);
            if (Array.isArray(projects) && projects.length > 0) {
                projectsTasksRelations.addRelation(projects, result.id)
                    .then(() => {
                        replay(result);
                    });
            } else {
                replay(result);
            }
        })
        .catch((err) => {
            debug(err);
            replay(boom.badRequest(errConstants.DB_ERROR));
        });
};

exports.update = (request, replay) => {
    const tokenData = auth.parseTokenData(request.headers.authorization);
    const { projects } = request.payload;
    const taskId = request.payload.id;
    if (!tokenData) {
        replay(boom.unauthorized(errConstants.NO_ID_IN_TOKEN));
        return;
    }
    const tasksData = {
        payload: request.payload,
        tokenId: tokenData.id,
    };
    tasks.updateTask(tasksData)
        .then((updatedData) => {
            debug(`Task id ${request.payload.id} updated`);
            if (taskId && projects) {
                return projectsTasksRelations.addRelation(projects, taskId)
                    .then(() => replay(updatedData));
            }
            replay(updatedData);
        })
        .catch((err) => {
            debug(err);
            replay(boom.badRequest(errConstants.DB_ERROR));
        });
};

exports.delete = (request, replay) => {
    const tokenData = auth.parseTokenData(request.headers.authorization);
    if (!tokenData) {
        replay(boom.unauthorized(errConstants.NO_ID_IN_TOKEN));
        return;
    }
    const tasksData = {
        payload: request.params.taskId,
        tokenId: tokenData.id,
    };
    tasks.deleteTask(tasksData)
        .then(() => {
            debug(`Task id ${request.params.taskId} deleted`);
            replay({});
        })
        .catch((err) => {
            debug(err);
            replay(boom.badRequest(errConstants.DB_ERROR));
        });
};

exports.connectProject = (request, replay) => {
    projectsTasksRelations.addRelation(request.params.projectId, request.params.taskId)
        .then(() => {
            debug(`Project id ${request.params.projectId} connected to task id ${request.params.taskId}`);
            replay({});
        })
        .catch((err) => {
            debug(err);
            replay(boom.badRequest(errConstants.DB_ERROR));
        });
};

exports.disconnectProject = (request, replay) => {
    projectsTasksRelations.deleteRelation(request.params.projectId, request.params.taskId)
        .then(() => {
            debug(`Project id ${request.params.projectId} disconnected from task id ${request.params.taskId}`);
            replay({});
        })
        .catch((err) => {
            debug(err);
            replay(boom.badRequest(errConstants.DB_ERROR));
        });
};

exports.updatePositions = (request, replay) => {
    const tokenData = auth.parseTokenData(request.headers.authorization);
    if (!tokenData) {
        replay(boom.unauthorized(errConstants.NO_ID_IN_TOKEN));
        return;
    }

    // ToDo: This is different from other requests
    // `payload` and `tokenId` are properties in `tasksData` object
    tasks.updateTaskPosition(Object.assign(request.payload, {tokenId: tokenData.id}))
        .then(() => {
            debug(`Task id ${request.payload.taskId} position updated`);
            replay({});
        })
        .catch((err) => {
            debug(err);
            replay(boom.badRequest(errConstants.DB_ERROR));
        });
};
