// ToDo: Refactor error handling and debug errors (see controllers/tasks.js)

const boom = require('boom');
const projects = require('../models/projects');
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
    const projectsData = {
        tokenId: tokenData.id,
    };
    projects.getAll(projectsData).then((projects) => {
        replay(projects);
    }, () => {
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
    projects.addNew(projectsData).then((result) => {
        replay(result);
    }, () => {
        replay(boom.badRequest(errConstants.DB_ERROR));
    });
};

exports.update = (request, replay) => {
    const tokenData = auth.parseTokenData(request.headers.authorization);
    const tasks = request.payload.tasks;
    const projectId = request.payload.id;
    if (!tokenData) {
        replay(boom.unauthorized(errConstants.NO_ID_IN_TOKEN));
        return;
    }
    const projectsData = {
        payload: request.payload,
        tokenId: tokenData.id,
    };
    projects.updateProject(projectsData).then((updatedData) => {
        if (tasks && projectId) {
            projectsTasksRelations.addRelation(projectId, tasks)
                .then(() => {
                    replay(updatedData);
                }, () => {
                    replay(boom.badRequest(errConstants.DB_ERROR));
                });
        } else {
            replay(updatedData);
        }
    }, () => {
        replay(boom.badRequest(errConstants.DB_ERROR));
    });
};

exports.delete = (request, replay) => {
    const tokenData = auth.parseTokenData(request.headers.authorization);
    const projectsData = {
        payload: request.params.projectId,
        tokenId: tokenData.id,
    };
    projects.deleteProject(projectsData).then(() => {
        replay({});
    }, () => {
        replay(boom.badRequest(errConstants.DB_ERROR));
    });
};

exports.connectTask = (request, replay) => {
    projectsTasksRelations.addRelation(request.params.projectId, request.params.taskId)
        .then(() => {
            replay({});
        }, () => {
            replay(boom.badRequest(errConstants.DB_ERROR));
        });
};

exports.disconnectTask = (request, replay) => {
    projectsTasksRelations.deleteRelation(request.params.projectId, request.params.taskId)
        .then(() => {
            replay({});
        }, () => {
            replay(boom.badRequest(errConstants.DB_ERROR));
        });
};
