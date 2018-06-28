const debug = require('debug')('pm:controllers:boards');
const Boom = require('boom');
const boards = require('../models/boards');
const errConstants = require('../constants/error');

exports.all = (req, res, next) => {
    debug(`Get all boards (user id ${req.authSession.userId})`);
    boards
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

exports.add = (req, res, next) => {
    const boardsData = {
        board: req.body,
        userId: req.authSession.userId,
    };

    debug(`Add board (user id ${boardsData.userId})`);
    boards
        .addNew(boardsData)
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
    const { id } = req.body;
    const boardsData = {
        board: req.body,
        userId: req.authSession.userId,
    };

    debug(`Update board with id: ${id} (user id ${boardsData.userId})`);
    boards
        .updateBoard(boardsData)
        .then(() => {
            debug(`Board id ${id} updated`);
            res.json({});
        })
        .catch((err) => {
            debug(err);
            next(Boom.badRequest(errConstants.DB_ERROR));
        });
};

exports.delete = (req, res, next) => {
    const boardId = req.swagger.params.boardId.value;
    const boardsData = {
        boardId,
        userId: req.authSession.userId,
    };

    debug(`Delete board with id: ${boardId} (user id ${boardsData.userId})`);
    boards
        .deleteBoard(boardsData)
        .then(() => {
            debug(`Board id ${boardId} deleted`);
            res.json({});
        })
        .catch((err) => {
            debug(err);
            next(Boom.badRequest(errConstants.DB_ERROR));
        });
};
