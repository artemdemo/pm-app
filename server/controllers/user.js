const debug = require('debug')('pm:controllers:index');
const JWT = require('jsonwebtoken');
const Boom = require('boom');
const sessions = require('../models/sessions');
const users = require('../models/users');
const secret = require('../secret');
const auth = require('../auth');
const errConstants = require('../constants/error');

const tokenOptions = {};

exports.user = (req, res, next) => {
    const tokenData = auth.parseTokenData(req.headers.authorization);
    if (!tokenData) {
        next(Boom.unauthorized(errConstants.NO_ID_IN_TOKEN));
        return;
    }
    sessions.getSession({
        id: tokenData.id,
    })
        .then((session) => {
            return users.getUserById(session.user_id);
        })
        .then((result) => {
            res.json(result);
        })
        .catch((err) => {
            debug(err);
            next(Boom.unauthorized(errConstants.USER_ERROR));
        });
};


exports.login = (req, res, next) => {
    users.getUser(req.body)
        .then((user) => {
            return sessions.addSession({
                user_id: user.id,
            }).then((result) => {
                const token = JWT.sign({
                    id: result.id,
                    expiration: result.expiration,
                }, secret.key, tokenOptions);

                debug(`User session id ${result.id} logged in`);
                res.header('Authorization', token).json(user);
            });
        })
        .catch((err) => {
            debug(err);
            next(Boom.unauthorized(errConstants.USER_ERROR));
        });
};


exports.signup = (req, res, next) => {
    users.addNew(req.body)
        .then((result) => {
            return sessions.addSession({
                user_id: result.id,
            });
        })
        .then((result) => {
            const token = JWT.sign({
                id: result.id,
                expiration: result.expiration,
            }, secret.key, tokenOptions);

            debug(`User session id ${result.id} signed up`);

            res.json({login: true}).header('Authorization', token);
        })
        .catch((err) => {
            debug(err);
            next(Boom.unauthorized(errConstants.USER_ERROR));
        });
};
