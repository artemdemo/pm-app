const debug = require('debug')('pm:controllers:settings');
const Boom = require('boom');
const settings = require('../models/settings');
const errConstants = require('../constants/error');

exports.all = (req, res, next) => {
    debug(`Get all settings (user id ${req.authSession.userId})`);
    settings
        .getAll({
            userId: req.authSession.userId,
        })
        .then((settings) => {
            res.json(settings);
        })
        .catch((err) => {
            debug(err);
            next(Boom.badRequest(errConstants.DB_ERROR));
        });
};
