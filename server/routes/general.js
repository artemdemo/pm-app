module.exports = [
    {
        method: 'GET',
        path: '/{path?}',
        config: { auth: false },
        handler: require('../controllers/index').index,
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
