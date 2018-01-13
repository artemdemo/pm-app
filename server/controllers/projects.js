const debug = require('debug')('pm:controllers:projects');
const boom = require('boom');
const _isNumber = require('lodash/isNumber');
const projects = require('../models/projects');
const projectsTasksRelations = require('../models/projects_tasks_relations');
const auth = require('../auth');
const errConstants = require('../constants/error');

exports.index = (request, replay) => replay.file('index.html');

exports.all = (request, replay) => {
    const tokenData = auth.parseTokenData(request.headers.authorization);
    if (!tokenData) {
        replay(boom.unauthorized(errConstants.NO_ID_IN_TOKEN));
        return;
    }
    const projectsData = {
        tokenId: tokenData.id,
    };
    projects.getAll(projectsData)
        .then((projects) => {
            replay(projects);
        })
        .catch((err) => {
            debug(err);
            replay(boom.badRequest(errConstants.DB_ERROR));
        });
};

exports.add = (request, replay) => {
    const tokenData = auth.parseTokenData(request.headers.authorization);
    if (!tokenData) {
        replay(boom.unauthorized(errConstants.NO_ID_IN_TOKEN));
        return;
    }
    const projectsData = {
        payload: request.payload,
        tokenId: tokenData.id,
    };
    projects.addNew(projectsData)
        .then((result) => {
            debug(`Project id ${result.id} created`);
            replay(result);
        })
        .catch((err) => {
            debug(err);
            replay(boom.badRequest(errConstants.DB_ERROR));
        });
};

exports.update = (request, replay) => {
    const tokenData = auth.parseTokenData(request.headers.authorization);
    const { id, tasks } = request.payload;
    if (!tokenData) {
        replay(boom.unauthorized(errConstants.NO_ID_IN_TOKEN));
        return;
    }
    const projectsData = {
        payload: request.payload,
        tokenId: tokenData.id,
    };
    projects.updateProject(projectsData)
        .then((updatedData) => {
            debug(`Project id ${request.payload.id} updated`);
            if (tasks && _isNumber(id)) {
                return projectsTasksRelations.addRelation(id, tasks)
                    .then(() => {
                        debug(`Added relations to project id ${request.payload.id} and tasks ${tasks}`);
                        replay(updatedData);
                    });
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
    const projectsData = {
        payload: request.params.projectId,
        tokenId: tokenData.id,
    };
    projects.deleteProject(projectsData)
        .then(() => {
            debug(`Project id ${request.params.projectId} deleted`);
            replay({});
        })
        .catch((err) => {
            debug(err);
            replay(boom.badRequest(errConstants.DB_ERROR));
        });
};

exports.connectTask = (request, replay) => {
    projectsTasksRelations.addRelation(request.params.projectId, request.params.taskId)
        .then(() => replay({}))
        .catch(() => {
            replay(boom.badRequest(errConstants.DB_ERROR));
        });
};

exports.disconnectTask = (request, replay) => {
    projectsTasksRelations.deleteRelation(request.params.projectId, request.params.taskId)
        .then(() => {
            debug(`Task id ${request.params.taskId} disconnected from project id ${request.params.projectId}`);
            replay({});
        })
        .catch((err) => {
            debug(err);
            replay(boom.badRequest(errConstants.DB_ERROR));
        });
};
