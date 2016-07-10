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
    }).then((session) => {
        users.getUserById(session.user_id)
            .then((result) => {
                reply(result);
            }, () => {
                reply(boom.unauthorized('No such user for given session'));
            });
    }, () => {
        reply(boom.unauthorized('Session error'));
    });
};


exports.login = (request, reply) => {
    users.getUser(request.payload)
        .then((user) => {
            sessions.addSession({
                user_id: user.id,
            }).then((result) => {
                const token = JWT.sign({
                    id: result.id,
                    expiration: result.expiration,
                }, secret.key, tokenOptions);

                reply(user).header('Authorization', token);
            }, () => {
                reply(boom.unauthorized('Session error'));
            });
        }, () => {
            reply(boom.unauthorized('Wrong user data'));
        });
};


exports.signup = (request, reply) => {
    users.addNew(request.payload)
        .then((result) => {
            sessions.addSession({
                user_id: result.id,
            }).then((result) => {
                const token = JWT.sign({
                    id: result.id,
                    expiration: result.expiration,
                }, secret.key, tokenOptions);

                reply({login: true}).header('Authorization', token);
            }, () => {
                reply(boom.unauthorized('Session error'));
            });
        }, () => {
            reply(boom.unauthorized('Adding new user error'));
        });
};
