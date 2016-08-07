/* eslint-disable no-console, strict*/
'use strict';

module.exports = [
    {
        method: 'GET',
        path: '/boards/all',
        config: { auth: 'jwt' },
        handler: require('../controllers/boards').all,
    },
    {
        method: 'POST',
        path: '/boards',
        config: { auth: 'jwt' },
        handler: require('../controllers/boards').add,
    },
    {
        method: 'PUT',
        path: '/boards',
        config: { auth: 'jwt' },
        handler: require('../controllers/boards').update,
    },
    {
        method: 'DELETE',
        path: '/boards/{boardId}',
        config: { auth: 'jwt' },
        handler: require('../controllers/boards').delete,
    },
    // {
    //     method: 'GET',
    //     path:'/boards/{boardId}/task/{taskId}',
    //     config: { auth: 'jwt' },
    //     handler: require('../controllers/boards').connectTask
    // },
    // {
    //     method: 'DELETE',
    //     path:'/boards/{boardId}/project/{taskId}',
    //     config: { auth: 'jwt' },
    //     handler: require('../controllers/boards').disconnectTask
    // }
];
