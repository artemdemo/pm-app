module.exports = [
    {
        method: 'GET',
        path: '/settings',
        config: { auth: false },
        handler: require('../controllers/settings').index,
    },
    {
        method: 'GET',
        path: '/settings/all',
        config: { auth: 'jwt' },
        handler: require('../controllers/settings').all,
    },
    {
        method: 'PUT',
        path: '/settings',
        handler: require('../controllers/settings').update,
    },
];
