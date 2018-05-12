const debug = require('debug')('pm:controllers:settings');
const Boom = require('boom');
const settings = require('../models/settings');
const auth = require('../auth');
const errConstants = require('../constants/error');

exports.all = (req, res, next) => {
    const tokenData = auth.parseTokenData(req.headers.authorization);
    if (!tokenData) {
        next(Boom.unauthorized(errConstants.NO_ID_IN_TOKEN));
        return;
    }
    const settingsData = {
        tokenId: tokenData.id,
    };
    settings.getAll(settingsData)
        .then((settings) => {
            res.json(settings);
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
    }
};

