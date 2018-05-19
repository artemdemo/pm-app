const jwt = require('jsonwebtoken');
const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;
const debug = require('debug')('pm:utils:passport');

const secret = require('../secret');

passport.use(new BearerStrategy((token, cb) => {
    jwt.verify(token, secret.key, (err, decoded) => {
        if (err) {
            debug(err);
            return cb(err);
        }
        debug('Token decoded');
        debug(decoded);
        return cb(null, decoded.id ? decoded.id : false);
    });
}));

module.exports = passport;
