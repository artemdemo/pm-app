'use strict';

const JWT = require('jsonwebtoken');
const boom = require('boom');
const sessions = require('../models/sessions');
const users = require('../models/users');
const secret = require('../secret');

const tokenOptions = {
    /*
     * Expiration data
     * useless if you are using ignoreExpiration
     */
    // expiresIn: '365 days'
};

exports.index = (request, reply) => reply.file('index.html');


exports.login = (request, reply) => {
    users.getUser(request.payload)
        .then((user) => {
            sessions.addSession({
                user_id: user.id
            }).then((result) => {
                const token = JWT.sign({
                    id: result.id,
                    expiration: result.expiration
                }, secret.key, tokenOptions);

                reply({login: true}).header('Authorization', token);
            }, () => {
                reply(boom.unauthorized('Session error'))
            });
        }, () => {
            reply(boom.unauthorized('Wrong user data'))
        });
};


exports.signup = (request, reply) => {
    users.addNew(request.payload)
        .then((result) => {
            sessions.addSession({
                user_id: result.id
            }).then((result) => {
                const token = JWT.sign({
                    id: result.id,
                    expiration: result.expiration
                }, secret.key, tokenOptions);

                reply({login: true}).header('Authorization', token);
            }, () => {
                reply(boom.unauthorized('Session error'))
            });
        }, () => {
            reply(boom.unauthorized('Adding new user error'))
        });
};
