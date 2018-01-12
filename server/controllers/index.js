const debug = require('debug')('pm:controllers:index');
const JWT = require('jsonwebtoken');
const boom = require('boom');
const sessions = require('../models/sessions');
const users = require('../models/users');
const secret = require('../secret');
const auth = require('../auth');
const errConstants = require('../constants/error');

const tokenOptions = {
    /*
     * Expiration data
     * useless if you are using ignoreExpiration
     */
    // expiresIn: '365 days'
};

exports.index = (request, reply) => reply.file('index.html');


exports.user = (request, reply) => {
    const tokenData = auth.parseTokenData(request.headers.authorization);
    if (!tokenData) {
        reply(boom.unauthorized(errConstants.NO_ID_IN_TOKEN));
        return;
    }
    sessions.getSession({
        id: tokenData.id,
    })
        .then((session) => {
            return users.getUserById(session.user_id);
        })
        .then((result) => {
            reply(result);
        })
        .catch((err) => {
            debug(err);
            reply(boom.unauthorized(errConstants.USER_ERROR));
        });
};


exports.login = (request, reply) => {
    users.getUser(request.payload)
        .then((user) => {
            return sessions.addSession({
                user_id: user.id,
            }).then((result) => {
                const token = JWT.sign({
                    id: result.id,
                    expiration: result.expiration,
                }, secret.key, tokenOptions);

                debug(`User session id ${result.id} logged in`);
                reply(user).header('Authorization', token);
            });
        })
        .catch((err) => {
            debug(err);
            reply(boom.unauthorized(errConstants.USER_ERROR));
        });
};


exports.signup = (request, reply) => {
    users.addNew(request.payload)
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

            reply({login: true}).header('Authorization', token);
        })
        .catch((err) => {
            debug(err);
            reply(boom.unauthorized(errConstants.USER_ERROR));
        });
};
