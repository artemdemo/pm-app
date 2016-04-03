'use strict';

const path = require('path');
const Hapi = require('hapi');
const inert = require('inert');
const chalk = require('chalk');
const routes = require('./routes');

// Normalize a port into a number, string, or false.
function normalizePort(val) {
    let port = parseInt(val, 10);

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
                relativeTo: path.join(__dirname, '../public')
            }
        }
    }
});

server.connection({
    host: 'localhost',
    port: normalizePort(process.env.PORT || 8000)
});

server.register(inert, () => {});

for (var route in routes) {
    server.route(routes[route]);
}

server.start((err) => {
    if (err) {
        throw err;
    }
    console.log(chalk.yellow.bold('Server is running at: ') + chalk.cyan(server.info.uri));
});

