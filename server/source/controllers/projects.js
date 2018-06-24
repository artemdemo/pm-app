const debug = require('debug')('pm:controllers:projects');
const Boom = require('boom');
const _isNumber = require('lodash/isNumber');
const _get = require('lodash/get');
const projects = require('../models/projects');
const projectsTasksRelations = require('../models/projects_tasks_relations');
const errConstants = require('../constants/error');

exports.all = (req, res, next) => {
    debug(`Get all projects (user id ${req.authSession.userId})`);
    projects
        .getAll({
            userId: req.authSession.userId,
        })
        .then((projects) => {
            res.json(projects);
        })
        .catch((err) => {
            debug(err);
            next(Boom.badRequest(errConstants.DB_ERROR));
        });
};

exports.one = (req, res, next) => {
    const projectId = req.swagger.params.projectId.value;
    const { userId } = req.authSession;
    debug(`Get project with id: ${projectId} (user id ${userId})`);
    projects
        .getById({
            projectId,
            userId,
        })
        .then(project => res.json(project))
        .catch((err) => {
            debug(err);
            next(Boom.badRequest(errConstants.DB_ERROR));
        });
};

exports.add = (req, res, next) => {
    const userId = req.authSession.userId;
    const projectsData = {
        project: req.body,
        userId,
    };
    debug(`Add project (user id ${userId})`);

    projects
        .addNew(projectsData)
        .then((result) => {
            debug(`Project id ${result.id} created`);
            return result.id;
        })
        .then((projectId) =>
            projects
                .getById({
                    projectId,
                    userId,
                }))
        .then(project => res.json(project))
        .catch((err) => {
            debug(err);
            next(Boom.badRequest(errConstants.DB_ERROR));
        });
};

exports.update = (req, res, next) => {
    const { id, tasks } = req.body;

    const userId = req.authSession.userId;
    const projectsData = {
        project: req.body,
        userId,
    };
    debug(`Update project with id: ${id} (user id ${userId})`);
    projects
        .updateProject(projectsData)
        .then(() => {
            debug(`Project id ${id} updated`);
            if (_get(tasks, 'length', 0) > 0 && _isNumber(id)) {
                return projectsTasksRelations
                    .addRelation(id, tasks.map(item => item.id))
                    .then(() => {
                        debug(`Added relations to project id ${id} and tasks ${JSON.stringify(tasks)}`);
                    });
            }
        })
        .then(() =>
            projects
                .getById({
                    projectId: id,
                    userId,
                }))
        .then(project => res.json(project))
        .catch((err) => {
            debug(err);
            next(Boom.badRequest(errConstants.DB_ERROR));
        });
};

exports.delete = (req, res, next) => {
    const userId = req.authSession.userId;
    const projectId = req.swagger.params.projectId.value;
    const projectsData = {
        projectId,
        userId,
    };
    debug(`Delete project with id: ${projectId} (user id ${userId})`);
    projects
        .deleteProject(projectsData)
        .then(() => {
            debug(`Project id ${projectId} deleted`);
            res.json({});
        })
        .catch((err) => {
            debug(err);
            next(Boom.badRequest(errConstants.DB_ERROR));
        });
};

exports.connectTask = (req, res, next) => {
    projectsTasksRelations
        .addRelation(req.params.projectId, req.params.taskId)
        .then(() => {
            debug(`Task id ${req.params.taskId} connected to project id ${req.params.projectId}`);
            res.json({});
        })
        .catch(() => {
            next(Boom.badRequest(errConstants.DB_ERROR));
        });
};

exports.disconnectTask = (req, res, next) => {
    projectsTasksRelations
        .deleteRelation(req.params.projectId, req.params.taskId)
        .then(() => {
            debug(`Task id ${req.params.taskId} disconnected from project id ${req.params.projectId}`);
            res.json({});
        })
        .catch((err) => {
            debug(err);
            next(Boom.badRequest(errConstants.DB_ERROR));
        });
};
