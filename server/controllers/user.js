const debug = require('debug')('pm:controllers:index');
const JWT = require('jsonwebtoken');
const Boom = require('boom');
const sessions = require('../models/sessions');
const users = require('../models/users');
const secret = require('../secret');
const errConstants = require('../constants/error');

const tokenOptions = {};

exports.user = (req, res, next) => {
    debug(`Get user data (user id ${req.authSession.userId})`);
    return users.getUserById(req.authSession.userId);
};

exports.login = (req, res, next) => {
    debug('Login');
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
    debug('Signup');
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
