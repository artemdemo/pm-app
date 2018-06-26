/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');
const express = require('express');
const debug = require('debug')('pm:index');
const Boom = require('boom');

const glob = require('glob');
const jsyaml = require('js-yaml');
const extendify = require('extendify');
const swaggerTools = require('swagger-tools');

const bodyParser = require('body-parser');
const DB = require('sqlite-crud');

const { addAuth } = require('./source/middleware/auth');

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
    const migrationPath = './source/models/migrations';
    debug(`Migrating DB, path to files with migrations is "${migrationPath}"`);
    DB.migrate(migrationPath)
        .catch((err) => {
            debug('Migration failed');
            debug(err);
        });
}


const app = express();
const isDevelopment = app.get('env') === 'development';

app.disable('x-powered-by');
app.use(bodyParser.json());

addAuth(app);

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'private, max-age=31557600');
    next();
});

app.use('/', express.static(path.join(__dirname, '../public')));

glob(`swagger/*.yaml`, (er, files) => {
    const contents = files.map((file) => {
        return jsyaml.load(fs.readFileSync(file).toString());
    });
    const swaggerDoc = contents
        .reduce(extendify({
            inPlace: false,
            isDeep: true,
        }));
    swaggerTools.initializeMiddleware(swaggerDoc, (middleware) => {
        app.use(middleware.swaggerMetadata());
        app.use(middleware.swaggerValidator());

        app.use(middleware.swaggerRouter({controllers: './source/controllers'}));
        app.use(middleware.swaggerUi({swaggerUi: '/api/docs', apiDocs: '/api/api-docs'}));

        app.use((err, req, res, next) => {
            const boomErr = (() => {
                if (!err.isBoom) {
                    const swaggerValidationError = err.failedValidation || err.allowedMethods;
                    const statusCode = swaggerValidationError ? res.statusCode : 500;
                    if (err.status === 401) {
                        debug(err.name, err.status);
                        debug(err.code, err.message);
                        return Boom.boomify(err, {
                            statusCode,
                            message: `${err.code}`,
                        });
                    }
                    return Boom.boomify(err, { statusCode });
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
    });
});

