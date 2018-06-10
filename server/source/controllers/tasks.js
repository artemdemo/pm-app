const debug = require('debug')('pm:controllers:task');
const Boom = require('boom');
const tasks = require('../models/tasks');
const projectsTasksRelations = require('../models/projects_tasks_relations');
const errConstants = require('../constants/error');

exports.all = (req, res, next) => {
    debug(`Get all tasks (user id ${req.authSession.userId})`);
    tasks
        .getAll({
            userId: req.authSession.userId,
        })
        .then((tasks) => {
            res.json(tasks);
        })
        .catch((err) => {
            debug(err);
            next(Boom.badRequest(errConstants.DB_ERROR));
        });
};

exports.one = (req, res, next) => {
    const { taskId } = req.params;
    const { userId } = req.authSession;
    debug(`Get task with id: ${taskId} (user id ${userId})`);
    tasks
        .getById({
            taskId,
            userId,
        })
        .then((tasks) => {
            res.json(tasks);
        })
        .catch((err) => {
            debug(err);
            next(Boom.badRequest(errConstants.DB_ERROR));
        });
};

exports.add = (req, res, next) => {
    const { projects } = req.body;
    const tasksData = {
        task: req.body,
        userId: req.authSession.userId,
    };
    debug(`Add task (user id ${tasksData.userId})`);
    debug(req.body);

    tasks
        .addNew(tasksData)
        .then((result) => {
            debug(`Task id ${result.id} created`);
            return tasks.getById({
                userId: req.authSession.userId,
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
    const { projects } = req.body;
    const taskId = req.body.id;
    const tasksData = {
        task: req.body,
        userId: req.authSession.userId,
    };
    debug(`Update task with id: ${taskId} (user id ${tasksData.userId})`);
    debug(req.body);
    tasks
        .updateTask(tasksData)
        .then(() => {
            return projectsTasksRelations
                .addRelation(projects, taskId)
                .then(() => {
                    debug(`Projects relations with task id ${taskId} updated`);
                });
        })
        .then(() => {
            return tasks
                .getById({
                    taskId,
                    userId: req.authSession.userId,
                });
        })
        .then(task => res.json(task))
        .catch((err) => {
            debug(err);
            next(Boom.badRequest(errConstants.DB_ERROR));
        });
};

exports.delete = (req, res, next) => {
    const tasksData = {
        taskId: req.params.taskId,
        userId: req.authSession.userId,
    };
    debug(`Delete task with id: ${tasksData.taskId} (user id ${tasksData.userId})`);
    tasks
        .deleteTask(tasksData)
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
    projectsTasksRelations
        .addRelation(req.params.projectId, req.params.taskId)
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
    projectsTasksRelations
        .deleteRelation(req.params.projectId, req.params.taskId)
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

    // ToDo: This is different from other reqs
    // `payload` and `tokenId` are properties in `tasksData` object
    tasks
        .updateTaskPosition(Object.assign(req.body, {userId: req.authSession.userId}))
        .then(() => {
            debug(`Task id ${req.body.taskId} position updated`);
            res.json({});
        })
        .catch((err) => {
            debug(err);
            next(Boom.badRequest(errConstants.DB_ERROR));
        });
};
