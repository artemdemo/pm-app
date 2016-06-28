'use strict';

const boom = require('boom');
const boards = require('../models/boards');
const auth = require('../auth');
const errConstants = require('../constants/error');

exports.index = (request, reply) => {
    reply.redirect('/');
};

exports.all = (request, reply) => {
    const tokenData = auth.parseTokenData(request.headers.authorization);
    if (!tokenData) {
        reply(boom.unauthorized(errConstants.NO_ID_IN_TOKEN));
        return;
    }
    const boardsData = {
        tokenId: tokenData.id
    };
    boards.getAll(boardsData).then((tasks) => {
        reply(tasks);
    }, () => {
        reply(boom.badRequest(errConstants.DB_ERROR))
    });
};

exports.add = (request, reply) => {
    const tokenData = auth.parseTokenData(request.headers.authorization);
    if (!tokenData) {
        reply(boom.unauthorized(errConstants.NO_ID_IN_TOKEN));
        return;
    }
    const boardsData = {
        payload: request.payload,
        tokenId: tokenData.id
    };
    boards.addNew(boardsData).then((result) => {
        reply(result);
    }, () => {
        reply(boom.badRequest(errConstants.DB_ERROR))
    });
};

exports.update = (request, reply) => {
    const tokenData = auth.parseTokenData(request.headers.authorization);
    if (!tokenData) {
        reply(boom.unauthorized(errConstants.NO_ID_IN_TOKEN));
        return;
    }
    const boardsData = {
        payload: request.payload,
        tokenId: tokenData.id
    };
    boards.updateBoard(boardsData).then(() => {
        reply({});
    }, () => {
        reply(boom.badRequest(errConstants.DB_ERROR))
    });
};

exports.delete = (request, reply) => {
    const tokenData = auth.parseTokenData(request.headers.authorization);
    if (!tokenData) {
        reply(boom.unauthorized(errConstants.NO_ID_IN_TOKEN));
        return;
    }
    const boardsData = {
        payload: request.params.taskId,
        tokenId: tokenData.id
    };
    boards.deleteBoard(boardsData).then(() => {
        reply({});
    }, () => {
        reply(boom.badRequest(errConstants.DB_ERROR))
    });
};
