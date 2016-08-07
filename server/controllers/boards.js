const boom = require('boom');
const boards = require('../models/boards');
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
    const boardsData = {
        tokenId: tokenData.id,
    };
    boards.getAll(boardsData).then((tasks) => {
        replay(tasks);
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
    const boardsData = {
        payload: request.payload,
        tokenId: tokenData.id,
    };
    boards.addNew(boardsData).then((result) => {
        replay(result);
    }, () => {
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
    boards.updateBoard(boardsData).then(() => {
        replay({});
    }, () => {
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
    boards.deleteBoard(boardsData).then(() => {
        replay({});
    }, () => {
        replay(boom.badRequest(errConstants.DB_ERROR));
    });
};
