const debug = require('debug')('pm:controllers:task');
const Boom = require('boom');
const tasks = require('../models/tasks');
const projectsTasksRelations = require('../models/projects_tasks_relations');
const auth = require('../auth');
const errConstants = require('../constants/error');

exports.all = (req, res, next) => {
    const tokenData = auth.parseTokenData(req.headers.authorization);
    if (!tokenData) {
        next(Boom.unauthorized(errConstants.NO_ID_IN_TOKEN));
        return;
    }
    const tasksData = {
        tokenId: tokenData.id,
    };
    tasks.getAll(tasksData)
        .then((tasks) => {
            res.json(tasks);
        })
        .catch((err) => {
            debug(err);
            next(Boom.badRequest(errConstants.DB_ERROR));
        });
};

exports.add = (req, res, next) => {
    const tokenData = auth.parseTokenData(req.headers.authorization);
    const { projects } = req.payload;
    if (!tokenData) {
        next(Boom.unauthorized(errConstants.NO_ID_IN_TOKEN));
        return;
    }
    const tasksData = {
        payload: req.payload,
        tokenId: tokenData.id,
    };
    tasks.addNew(tasksData)
        .then((result) => {
            debug(`Task id ${result.id} created`);
            return tasks.getById({
                tokenId: tokenData.id,
                taskId: result.id,
            });
        })
        .then((task) => {
            if (!task) {
                throw new Error('No task was found, probably given id is incorrect');
            } else if (Array.isArray(projects) && projects.length > 0) {
                return projectsTasksRelations
                    .addRelation(projects, task.id)
                    .then(() => {
                        debug(`Projects relations with task id ${task.id} updated`);
                        return task;
                    });
            }
            return task;
        })
        .then(task => res.json(task))
        .catch((err) => {
            debug(err);
            next(Boom.badRequest(errConstants.DB_ERROR));
        });
};

exports.update = (req, res, next) => {
    const tokenData = auth.parseTokenData(req.headers.authorization);
    const { projects } = req.payload;
    const taskId = req.payload.id;
    if (!tokenData) {
        next(Boom.unauthorized(errConstants.NO_ID_IN_TOKEN));
        return;
    }
    const tasksData = {
        payload: req.payload,
        tokenId: tokenData.id,
    };
    tasks.updateTask(tasksData)
        .then(() => {
            debug(`Task id ${req.payload.id} updated`);
            return tasks.getById({
                tokenId: tokenData.id,
                taskId: req.payload.id,
            });
        })
        .then((task) => {
            if (taskId && projects) {
                return projectsTasksRelations.addRelation(projects, taskId)
                    .then(() => {
                        debug(`Projects relations with task id ${task.id} updated`);
                        return task;
                    });
            }
            return task;
        })
        .then(task => res.json(task))
        .catch((err) => {
            debug(err);
            next(Boom.badRequest(errConstants.DB_ERROR));
        });
};

exports.delete = (req, res, next) => {
    const tokenData = auth.parseTokenData(req.headers.authorization);
    if (!tokenData) {
        next(Boom.unauthorized(errConstants.NO_ID_IN_TOKEN));
        return;
    }
    const tasksData = {
        payload: req.params.taskId,
        tokenId: tokenData.id,
    };
    tasks.deleteTask(tasksData)
        .then(() => {
            debug(`Task id ${req.params.taskId} deleted`);
            res.json({});
        })
        .catch((err) => {
            debug(err);
            next(Boom.badRequest(errConstants.DB_ERROR));
        });
};

exports.connectProject = (req, res, next) => {
    projectsTasksRelations.addRelation(req.params.projectId, req.params.taskId)
        .then(() => {
            debug(`Project id ${req.params.projectId} connected to task id ${req.params.taskId}`);
            res.json({});
        })
        .catch((err) => {
            debug(err);
            next(Boom.badRequest(errConstants.DB_ERROR));
        });
};

exports.disconnectProject = (req, res, next) => {
    projectsTasksRelations.deleteRelation(req.params.projectId, req.params.taskId)
        .then(() => {
            debug(`Project id ${req.params.projectId} disconnected from task id ${req.params.taskId}`);
            res.json({});
        })
        .catch((err) => {
            debug(err);
            next(Boom.badRequest(errConstants.DB_ERROR));
        });
};

exports.updatePositions = (req, res, next) => {
    const tokenData = auth.parseTokenData(req.headers.authorization);
    if (!tokenData) {
        next(Boom.unauthorized(errConstants.NO_ID_IN_TOKEN));
        return;
    }

    // ToDo: This is different from other reqs
    // `payload` and `tokenId` are properties in `tasksData` object
    tasks.updateTaskPosition(Object.assign(req.payload, {tokenId: tokenData.id}))
        .then(() => {
            debug(`Task id ${req.payload.taskId} position updated`);
            res.json({});
        })
        .catch((err) => {
            debug(err);
            next(Boom.badRequest(errConstants.DB_ERROR));
        });
};
