/* eslint-disable no-console, strict*/
'use strict';

module.exports = [
    {
        method: 'GET',
        path: '/projects',
        config: { auth: false },
        handler: require('../controllers/projects').index,
    },
    {
        method: 'GET',
        path: '/projects/all',
        config: { auth: 'jwt' },
        handler: require('../controllers/projects').all,
    },
    {
        method: 'POST',
        path: '/projects',
        config: { auth: 'jwt' },
        handler: require('../controllers/projects').add,
    },
    {
        method: 'PUT',
        path: '/projects',
        handler: require('../controllers/projects').update,
    },
    {
        method: 'DELETE',
        path: '/projects/{projectId}',
        config: { auth: 'jwt' },
        handler: require('../controllers/projects').delete,
    },
    {
        method: 'GET',
        path: '/projects/{taskId}/task/{projectId}',
        config: { auth: 'jwt' },
        handler: require('../controllers/projects').connectTask,
    },
    {
        method: 'DELETE',
        path: '/projects/{taskId}/task/{projectId}',
        config: { auth: 'jwt' },
        handler: require('../controllers/projects').disconnectTask,
    },
];
