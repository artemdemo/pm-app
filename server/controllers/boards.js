const debug = require('debug')('pm:controllers:boards');
const boom = require('boom');
const boards = require('../models/boards');
const auth = require('../auth');
const errConstants = require('../constants/error');

exports.index = (request, replay) => replay.file('index.html');

exports.all = (request, replay) => {
    const tokenData = auth.parseTokenData(request.headers.authorization);
    if (!tokenData) {
        replay(boom.unauthorized(errConstants.NO_ID_IN_TOKEN));
        return;
    }
    const boardsData = {
        tokenId: tokenData.id,
    };
    boards.getAll(boardsData)
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
    if (!tokenData) {
        replay(boom.unauthorized(errConstants.NO_ID_IN_TOKEN));
        return;
    }
    const boardsData = {
        payload: request.payload,
        tokenId: tokenData.id,
    };

    debug('Add board:');
    debug(request.payload);

    boards.addNew(boardsData)
        .then((result) => {
            debug(`Board id ${result.id} created`);
            replay(result);
        })
        .catch((err) => {
            debug(err);
            replay(boom.badRequest(errConstants.DB_ERROR));
        });
};

exports.update = (request, replay) => {
    const tokenData = auth.parseTokenData(request.headers.authorization);
    if (!tokenData) {
        replay(boom.unauthorized(errConstants.NO_ID_IN_TOKEN));
        return;
    }
    const boardsData = {
        payload: request.payload,
        tokenId: tokenData.id,
    };

    debug('Update board:');
    debug(request.payload);

    boards.updateBoard(boardsData)
        .then((board) => {
            debug(`Board id ${request.payload.id} updated`);
            replay(board);
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
    const boardsData = {
        payload: request.params.boardId,
        tokenId: tokenData.id,
    };

    debug(`Delete board id ${request.params.boardId}`);

    boards.deleteBoard(boardsData)
        .then(() => {
            debug(`Board id ${request.params.boardId} deleted`);
            replay({});
        })
        .catch((err) => {
            debug(err);
            replay(boom.badRequest(errConstants.DB_ERROR));
        });
};
