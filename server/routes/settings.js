module.exports = [
    {
        method: 'GET',
        path: '/api/settings',
        config: { auth: 'jwt' },
        handler: require('../controllers/settings').all,
    },
    {
        method: 'PUT',
        path: '/api/settings',
        handler: require('../controllers/settings').update,
    },
];
