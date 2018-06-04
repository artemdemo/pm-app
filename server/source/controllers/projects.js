const debug = require('debug')('pm:controllers:projects');
const Boom = require('boom');
const _isNumber = require('lodash/isNumber');
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
    const { projectId } = req.params;
    const { userId } = req.authSession;
    debug(`Get project with id: ${projectId} (user id ${userId})`);
    projects
        .getById({
            projectId,
            userId,
        })
        .then((projects) => {
            res.json(projects);
        })
        .catch((err) => {
            debug(err);
            next(Boom.badRequest(errConstants.DB_ERROR));
        });
};

exports.add = (req, res, next) => {
    const projectsData = {
        project: req.body,
        userId: req.authSession.userId,
    };
    debug(`Add project (user id ${projectsData.userId})`);

    projects
        .addNew(projectsData)
        .then((result) => {
            debug(`Project id ${result.id} created`);
            res.json(result);
        })
        .catch((err) => {
            debug(err);
            next(Boom.badRequest(errConstants.DB_ERROR));
        });
};

exports.update = (req, res, next) => {
    const { id, tasks } = req.body;

    const projectsData = {
        project: req.body,
        userId: req.authSession.userId,
    };
    debug(`Update project with id: ${id} (user id ${projectsData.userId})`);
    projects
        .updateProject(projectsData)
        .then((updatedData) => {
            debug(`Project id ${id} updated`);
            if (tasks && _isNumber(id)) {
                return projectsTasksRelations
                    .addRelation(id, tasks)
                    .then(() => {
                        debug(`Added relations to project id ${id} and tasks ${tasks}`);
                        res.json(updatedData);
                    });
            }
            res.json(updatedData);
        })
        .catch((err) => {
            debug(err);
            next(Boom.badRequest(errConstants.DB_ERROR));
        });
};

exports.delete = (req, res, next) => {
    const projectsData = {
        projectId: req.params.projectId,
        userId: req.authSession.userId,
    };
    debug(`Delete project with id: ${projectsData.projectId} (user id ${projectsData.userId})`);
    projects
        .deleteProject(projectsData)
        .then(() => {
            debug(`Project id ${req.params.projectId} deleted`);
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
