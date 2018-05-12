/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');
const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('pm:index');
const Boom = require('boom');
const DB = require('sqlite-crud');
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

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'private, max-age=31557600');
    next();
});

app.use('/', express.static(path.join(__dirname, '../public')));

app.use('/api', apiRouter);

app.use((err, req, res, next) => {
    const boomErr = (() => {
        if (!err.isBoom) {
            if (err.failedValidation) {
                return Boom.boomify(err, { statusCode: 400 });
            }
            return Boom.boomify(err, { statusCode: 500 });
        }
        return err;
    })();
    res.status(boomErr.output.statusCode).send(boomErr.output.payload);
});

// Create a server with a host and port
// const server = new Hapi.Server({
//     connections: {
//         routes: {
//             files: {
//                 relativeTo: path.join(__dirname, '../public'),
//             },
//         },
//     },
// });

// server.connection({
//     host: 'localhost',
//     port: normalizePort(process.env.PORT || 3000),
// });

// Dynamically include routes
// Function will recursively enter all directories and include all '*.js' files
// const routerDirWalker = (dirPath) => {
//     fs.readdirSync(dirPath).forEach((file) => {
//         if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
//             routerDirWalker(path.join(dirPath, file));
//         } else {
//             const pathToRoute = '.' + path.sep + path.join(dirPath, file.split('.').shift());
//             const routes = require(pathToRoute.replace(/\\/g, '/').replace('/server', ''));
//             for (const route in routes) {
//                 server.route(routes[route]);
//             }
//         }
//     });
// };

// inert provides new handler methods for serving static files and directories,
// as well as decorating the reply interface with a file method for serving file based resources.
// server.register(inert, () => {
//
//     server.register(hapiAuthJwt, () => {
//         // Generating secure key (base64, 256 random bytes)
//         // https://tonicdev.com/artemdemo/5736ead43ed13c11004bb76b
//         server.auth.strategy('jwt', 'jwt', {
//             key: require('./secret').key,
//             validateFunc: require('./auth').validate,
//             verifyOptions: {
//                 ignoreExpiration: true,
//                 algorithms: ['HS256'],
//             },
//         });
//
//         server.auth.default('jwt');
//
//         startServer().then(() => {
//             console.log(chalk.yellow.bold('Server is running at: ') + chalk.cyan(server.info.uri));
//         });
//     });
// });

// Start the server
// async function startServer() {
//     try {
//         routerDirWalker('./routes');
//         await server.start();
//     } catch (err) {
//         debug(err);
//         process.exit(1);
//     }
// }

const port = (() => {
    if (!isDevelopment) {
        return process.env.PORT || 8080;
    }
    return process.env.PORT || 3000;
})();
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

