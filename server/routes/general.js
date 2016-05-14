'use strict';

module.exports = [
    {
        method: 'GET',
        path:'/{path?}',
        handler: require('../controllers/index').index
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
        path:'/images/{param*}',
        handler: {
            directory: {
                path: '../public/images'
            }
        }
    }
];
