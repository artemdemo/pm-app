'use strict';

module.exports = [
    {
        method: 'GET',
        path:'/',
        handler: require('./controllers/index').index
    },
    {
        method: 'GET',
        path:'/js/{param*}',
        handler: {
            directory: {
                path: '../public/js'
            }
        }
    },
    {
        method: 'GET',
        path:'/css/{param*}',
        handler: {
            directory: {
                path: '../public/css'
            }
        }
    },
    {
        method: 'GET',
        path:'/fonts/{param*}',
        handler: {
            directory: {
                path: '../public/fonts'
            }
        }
    },
    {
        method: 'GET',
        path:'/tasks',
        handler: require('./controllers/tasks').index
    },
    {
        method: 'GET',
        path:'/tasks/all',
        handler: require('./controllers/tasks').all
    },
    {
        method: 'POST',
        path:'/tasks/add',
        handler: require('./controllers/tasks').add
    },
    {
        method: 'PUT',
        path:'/tasks/update',
        handler: require('./controllers/tasks').update
    }
];
