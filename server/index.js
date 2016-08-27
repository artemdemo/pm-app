/* eslint-disable no-console, strict*/
'use strict';

const fs = require('fs');
const path = require('path');
const Hapi = require('hapi');
const inert = require('inert');
const chalk = require('chalk');
const hapiAuthJwt = require('hapi-auth-jwt2');
const DB = require('sqlite-crud');
let pathToTheDB;
let cliDBPath = '';
let migrateDB = false;
let appSettings = {};

try {
    appSettings = require('../app-settings.json');
} catch (e) {
    console.log(`${chalk.yellow('[Info]')} app-settings.json - not found`);
}

if (appSettings.db) {
    pathToTheDB = appSettings.db;
}

// node ./server/index --db=e2e-test.db --migrate
process.argv.forEach((value) => {
    if (~value.indexOf('--db')) {
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
        } catch (e) {
            migrateDB = true;
        }
    }
}

DB.connectToDB(pathToTheDB);
DB.setVerbose(false);
if (migrateDB) {
    const migrationPath = 'server/models/migrations';
    console.log(chalk.yellow('[Migrating DB] ') + migrationPath);
    DB.migrate(migrationPath);
}

// Normalize a port into a number, string, or false.
function normalizePort(val) {
    const port = parseInt(val, 10);

    switch (true) {
        case (isNaN(port)):
            return val;
        case port >= 0:
            return port;
        default:
            return false;
    }
}

// Create a server with a host and port
const server = new Hapi.Server({
    connections: {
        routes: {
            files: {
                relativeTo: path.join(__dirname, '../public'),
            },
        },
    },
});

server.connection({
    host: 'localhost',
    port: normalizePort(process.env.PORT || 8000),
});

// inert provides new handler methods for serving static files and directories,
// as well as decorating the reply interface with a file method for serving file based resources.
server.register(inert, () => {});

/**
 * Authentication
 */
server.register(hapiAuthJwt, () => {});

// Generating secure key (base64, 256 random bytes)
// https://tonicdev.com/artemdemo/5736ead43ed13c11004bb76b
server.auth.strategy('jwt', 'jwt', {
    key: require('./secret').key,
    validateFunc: require('./auth').validate,
    verifyOptions: {
        ignoreExpiration: true,
        algorithms: ['HS256'],
    },
});

server.auth.default('jwt');

/**
 * Routing
 */
// Dynamically include routes
// Function will recursively enter all directories and include all '*.js' files
const routerDirWalker = (dirPath) => {
    fs.readdirSync(dirPath).forEach((file) => {
        if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
            routerDirWalker(path.join(dirPath, file));
        } else {
            const pathToRoute = '.' + path.sep + path.join(dirPath, file.split('.').shift());
            const routes = require(pathToRoute.replace(/\\/g, '/').replace('/server', ''));
            for (const route in routes) {
                server.route(routes[route]);
            }
        }
    });
};
routerDirWalker('./server/routes');

server.start((err) => {
    if (err) {
        throw err;
    }
    console.log(chalk.yellow.bold('Server is running at: ') + chalk.cyan(server.info.uri));
});
