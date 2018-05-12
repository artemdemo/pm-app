const debug = require('debug')('pm:controllers:boards');
const Boom = require('boom');
const boards = require('../models/boards');
const auth = require('../auth');
const errConstants = require('../constants/error');

exports.all = (req, res, next) => {
    const tokenData = auth.parseTokenData(req.headers.authorization);
    if (!tokenData) {
        next(Boom.unauthorized(errConstants.NO_ID_IN_TOKEN));
        return;
    }
    const boardsData = {
        tokenId: tokenData.id,
    };
    boards.getAll(boardsData)
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
    if (!tokenData) {
        next(Boom.unauthorized(errConstants.NO_ID_IN_TOKEN));
        return;
    }
    const boardsData = {
        payload: req.payload,
        tokenId: tokenData.id,
    };

    debug('Add board:');
    debug(req.payload);

    boards.addNew(boardsData)
        .then((result) => {
            debug(`Board id ${result.id} created`);
            res.json(result);
        })
        .catch((err) => {
            debug(err);
            next(Boom.badRequest(errConstants.DB_ERROR));
        });
};

exports.update = (req, res, next) => {
    const tokenData = auth.parseTokenData(req.headers.authorization);
    if (!tokenData) {
        next(Boom.unauthorized(errConstants.NO_ID_IN_TOKEN));
        return;
    }
    const boardsData = {
        payload: req.payload,
        tokenId: tokenData.id,
    };

    debug('Update board:');
    debug(req.payload);

    boards.updateBoard(boardsData)
        .then(() => {
            debug(`Board id ${req.payload.id} updated`);
            res.json({});
        })
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
    const boardsData = {
        payload: req.params.boardId,
        tokenId: tokenData.id,
    };

    debug(`Delete board id ${req.params.boardId}`);

    boards.deleteBoard(boardsData)
        .then(() => {
            debug(`Board id ${req.params.boardId} deleted`);
            res.json({});
        })
        .catch((err) => {
            debug(err);
            next(Boom.badRequest(errConstants.DB_ERROR));
        });
};
