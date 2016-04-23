'use strict';

module.exports = [
    {
        method: 'GET',
        path:'/tasks',
        handler: require('../controllers/tasks').index
    },
    {
        method: 'GET',
        path:'/tasks/all',
        handler: require('../controllers/tasks').all
    },
    {
        method: 'POST',
        path:'/tasks',
        handler: require('../controllers/tasks').add
    },
    {
        method: 'PUT',
        path:'/tasks',
        handler: require('../controllers/tasks').update
    },
    {
        method: 'DELETE',
        path:'/tasks/{taskId}',
        handler: require('../controllers/tasks').delete
    }
];
