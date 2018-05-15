const Boom = require('boom');
const jwt = require('express-jwt');
const debug = require('debug')('pm:middleware.auth');
const secret = require('../secret');
const sessions = require('../models/sessions');

const jwtMiddleware = jwt({
    secret: secret.key,
    credentialsRequired: false,
    requestProperty: 'auth',
    getToken: (req) => {
        const authParts = req.headers.authorization.split(' ');
        if (req.headers.authorization && authParts[0] === 'Bearer') {
            return authParts[1];
        }
        debug(`There is no "Bearer" token in the header - ${req.url}`);
        return null;
    },
});

const sessionMiddleware = (req, res, next) => {
    if (req.auth) {
        sessions.getSession({
            id: req.auth.id,
        }).then((session) => {
            req.authSession = {
                id: session.id,
                userId: session.user_id,
                expiration: session.expiration,
            };
            next();
        });
    } else {
        const allowedUrls = [
            /\/api\/login/,
            /\/api\/signup/,
        ];
        const allowed = allowedUrls.some(urlRegex => urlRegex.test(req.url));
        if (allowed) {
            next();
        } else {
            debug(`Required authorization for the given url - ${req.url}`);
            next(Boom.unauthorized());
        }
    }
};

module.exports.addAuth = (app) => {
    app.use(jwtMiddleware);
    app.use(sessionMiddleware);
};
