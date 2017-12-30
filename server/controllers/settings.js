const debug = require('debug')('pm:controllers:settings');
const boom = require('boom');
const settings = require('../models/settings');
const auth = require('../auth');
const errConstants = require('../constants/error');

exports.index = (request, replay) => replay.file('index.html');

exports.all = (request, replay) => {
    const tokenData = auth.parseTokenData(request.headers.authorization);
    if (!tokenData) {
        replay(boom.unauthorized(errConstants.NO_ID_IN_TOKEN));
        return;
    }
    const settingsData = {
        tokenId: tokenData.id,
    };
    settings.getAll(settingsData)
        .then((settings) => {
            replay(settings);
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
    }
};

