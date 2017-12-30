/* eslint-disable global-require */

module.exports = [
    {
        method: 'GET',
        path: '/{path?}',
        config: { auth: false },
        handler: require('../controllers/index').index,
    },
    {
        method: 'PUT',
        path: '/login',
        config: { auth: false },
        handler: require('../controllers/index').login,
    },
    {
        method: 'POST',
        path: '/signup',
        config: { auth: false },
        handler: require('../controllers/index').signup,
    },
    {
        method: 'GET',
        path: '/user',
        config: { auth: 'jwt' },
        handler: require('../controllers/index').user,
    },
    {
        method: 'GET',
        path: '/js/{param*}',
        config: { auth: false },
        handler: {
            directory: {
                path: '../public/js',
            },
        },
    },
    {
        method: 'GET',
        path: '/css/{param*}',
        config: { auth: false },
        handler: {
            directory: {
                path: '../public/css',
            },
        },
    },
    {
        method: 'GET',
        path: '/fonts/{param*}',
        config: { auth: false },
        handler: {
            directory: {
                path: '../public/fonts',
            },
        },
    },
    {
        method: 'GET',
        path: '/images/{param*}',
        config: { auth: false },
        handler: {
            directory: {
                path: '../public/images',
            },
        },
    },
];
