'use strict';

module.exports = [
    {
        method: 'GET',
        path:'/projects',
        handler: require('../controllers/projects').index
    },
    {
        method: 'GET',
        path:'/projects/all',
        handler: require('../controllers/projects').all
    },
    {
        method: 'POST',
        path:'/projects',
        handler: require('../controllers/projects').add
    },
    {
        method: 'PUT',
        path:'/projects',
        handler: require('../controllers/projects').update
    },
    {
        method: 'DELETE',
        path:'/projects/{taskId}',
        handler: require('../controllers/projects').delete
    }
];
