'use strict';

const JWT = require('jsonwebtoken');
const sessions = require('../models/sessions');

exports.index = (request, reply) => reply.file('index.html');

exports.login = (request, reply) => {
    sessions.addSession({
        user_id: 1
    }).then((result) => {
        const token = JWT.sign({
            id: result.id,
            expiration: result.expiration
        }, require('../secret').key);

        reply({login: true}).header('Authorization', token);
    }, () => {
        reply(boom.unauthorized('Session error'))
    });
};
