const debug = require('debug')('pm:controllers:projects');
const Boom = require('boom');
const _isNumber = require('lodash/isNumber');
const projects = require('../models/projects');
const projectsTasksRelations = require('../models/projects_tasks_relations');
const auth = require('../auth');
const errConstants = require('../constants/error');

exports.all = (req, res, next) => {
    const tokenData = auth.parseTokenData(req.headers.authorization);
    if (!tokenData) {
        next(Boom.unauthorized(errConstants.NO_ID_IN_TOKEN));
        return;
    }
    const projectsData = {
        tokenId: tokenData.id,
    };
    projects.getAll(projectsData)
        .then((projects) => {
            res.json(projects);
        })
        .catch((err) => {
            debug(err);
            next(Boom.badRequest(errConstants.DB_ERROR));
        });
};

exports.add = (req, res, next) => {
    const tokenData = auth.parseTokenData(req.headers.authorization);
    if (!tokenData) {
        next(Boom.unauthorized(errConstants.NO_ID_IN_TOKEN));
        return;
    }
    const projectsData = {
        payload: req.payload,
        tokenId: tokenData.id,
    };
    projects.addNew(projectsData)
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
    const tokenData = auth.parseTokenData(req.headers.authorization);
    const { id, tasks } = req.payload;
    if (!tokenData) {
        next(Boom.unauthorized(errConstants.NO_ID_IN_TOKEN));
        return;
    }
    const projectsData = {
        payload: req.payload,
        tokenId: tokenData.id,
    };
    projects.updateProject(projectsData)
        .then((updatedData) => {
            debug(`Project id ${req.payload.id} updated`);
            if (tasks && _isNumber(id)) {
                return projectsTasksRelations.addRelation(id, tasks)
                    .then(() => {
                        debug(`Added relations to project id ${req.payload.id} and tasks ${tasks}`);
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
    const tokenData = auth.parseTokenData(req.headers.authorization);
    const projectsData = {
        payload: req.params.projectId,
        tokenId: tokenData.id,
    };
    projects.deleteProject(projectsData)
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
    projectsTasksRelations.addRelation(req.params.projectId, req.params.taskId)
        .then(() => res.json({}))
        .catch(() => {
            next(Boom.badRequest(errConstants.DB_ERROR));
        });
};

exports.disconnectTask = (req, res, next) => {
    projectsTasksRelations.deleteRelation(req.params.projectId, req.params.taskId)
        .then(() => {
            debug(`Task id ${req.params.taskId} disconnected from project id ${req.params.projectId}`);
            res.json({});
        })
        .catch((err) => {
            debug(err);
            next(Boom.badRequest(errConstants.DB_ERROR));
        });
};
