/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');
const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('pm:index');
const Boom = require('boom');
const bodyParser = require('body-parser');
const DB = require('sqlite-crud');

const jwt = require('express-jwt');
const sessions = require('./models/sessions');
const secret = require('./secret');

const apiRouter = require('./routes/apiRouter');


let pathToTheDB;
let cliDBPath = '';
let migrateDB = false;
let appSettings = {};

try {
    appSettings = require('../app-settings.json');
} catch (e) {
    debug('app-settings.json - not found');
    debug('Using default settings instead');
}

if (appSettings.db) {
    pathToTheDB = appSettings.db;
}

// node ./server/index --db=e2e-test.db --migrate
process.argv.forEach((value) => {
    if (value.indexOf('--db') > -1) {
        const match = /--db=(\S+.db)$/.exec(value);
        if (match) {
            cliDBPath = match[1];
        }
    } else if (value === '--migrate') {
        migrateDB = true;
    }
});

if (cliDBPath) {
    pathToTheDB = cliDBPath;
} else {
    try {
        fs.lstatSync(pathToTheDB);
    } catch (e) {
        // If there is no DB, then I will create new DB in default path
        pathToTheDB = './pm.db';
        try {
            fs.lstatSync(pathToTheDB);
            debug(`DB file found in path "${pathToTheDB}"`);
        } catch (e) {
            migrateDB = true;
        }
    }
}

DB.connectToDB(pathToTheDB);
if (migrateDB) {
    const migrationPath = './models/migrations';
    debug(`Migrating DB, path to files with migrations is "${migrationPath}"`);
    DB.migrate(migrationPath)
        .catch((err) => {
            debug('Migration failed');
            debug(err);
        });
}


const app = express();
const isDevelopment = app.get('env') === 'development';

app.use(bodyParser.json());

app.use(jwt({
    secret: secret.key,
    credentialsRequired: false,
    requestProperty: 'auth',
    getToken: (req) => {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            return req.headers.authorization.split(' ')[1];
        } else if (req.query && req.query.token) {
            return req.query.token;
        }
        return null;
    },
}));

app.use((req, res, next) => {
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
        next();
    }
});

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'private, max-age=31557600');
    next();
});

app.use('/', express.static(path.join(__dirname, '../public')));
app.use('/api', apiRouter);

app.use((err, req, res, next) => {
    const boomErr = (() => {
        if (!err.isBoom) {
            // ToDo: I'm not sure that in current implementation (with express) it will work
            if (err.failedValidation) {
                return Boom.boomify(err, { statusCode: 400 });
            }
            return Boom.boomify(err, { statusCode: 500 });
        }
        return err;
    })();
    res.status(boomErr.output.statusCode).send(boomErr.output.payload);
});

const port = (() => {
    if (!isDevelopment) {
        return process.env.PORT || 8080;
    }
    return process.env.PORT || 3000;
})();
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

