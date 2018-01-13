module.exports = [
    {
        method: 'GET',
        path: '/api/projects',
        config: { auth: 'jwt' },
        handler: require('../controllers/projects').all,
    },
    {
        method: 'POST',
        path: '/api/projects',
        config: { auth: 'jwt' },
        handler: require('../controllers/projects').add,
    },
    {
        method: 'PUT',
        path: '/api/projects',
        handler: require('../controllers/projects').update,
    },
    {
        method: 'DELETE',
        path: '/api/projects/{projectId}',
        config: { auth: 'jwt' },
        handler: require('../controllers/projects').delete,
    },
    {
        method: 'GET',
        path: '/api/projects/{taskId}/task/{projectId}',
        config: { auth: 'jwt' },
        handler: require('../controllers/projects').connectTask,
    },
    {
        method: 'DELETE',
        path: '/api/projects/{taskId}/task/{projectId}',
        config: { auth: 'jwt' },
        handler: require('../controllers/projects').disconnectTask,
    },
];
