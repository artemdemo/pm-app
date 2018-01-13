module.exports = [
    {
        method: 'GET',
        path: '/api/boards',
        config: { auth: 'jwt' },
        handler: require('../controllers/boards').all,
    },
    {
        method: 'POST',
        path: '/api/boards',
        config: { auth: 'jwt' },
        handler: require('../controllers/boards').add,
    },
    {
        method: 'PUT',
        path: '/api/boards',
        config: { auth: 'jwt' },
        handler: require('../controllers/boards').update,
    },
    {
        method: 'DELETE',
        path: '/api/boards/{boardId}',
        config: { auth: 'jwt' },
        handler: require('../controllers/boards').delete,
    },
];
