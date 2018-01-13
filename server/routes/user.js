module.exports = [
    {
        method: 'PUT',
        path: '/api/login',
        config: { auth: false },
        handler: require('../controllers/index').login,
    },
    {
        method: 'POST',
        path: '/api/signup',
        config: { auth: false },
        handler: require('../controllers/index').signup,
    },
    {
        method: 'GET',
        path: '/api/user',
        config: { auth: 'jwt' },
        handler: require('../controllers/index').user,
    },
];
