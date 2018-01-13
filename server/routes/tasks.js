module.exports = [
    {
        method: 'GET',
        path: '/api/tasks',
        config: { auth: 'jwt' },
        handler: require('../controllers/tasks').all,
    },
    {
        method: 'POST',
        path: '/api/tasks',
        config: { auth: 'jwt' },
        handler: require('../controllers/tasks').add,
    },
    {
        method: 'PUT',
        path: '/api/tasks',
        config: { auth: 'jwt' },
        handler: require('../controllers/tasks').update,
    },
    {
        method: 'DELETE',
        path: '/api/tasks/{taskId}',
        config: { auth: 'jwt' },
        handler: require('../controllers/tasks').delete,
    },
    {
        method: 'GET',
        path: '/api/tasks/{taskId}/project/{projectId}',
        config: { auth: 'jwt' },
        handler: require('../controllers/tasks').connectProject,
    },
    {
        method: 'DELETE',
        path: '/api/tasks/{taskId}/project/{projectId}',
        config: { auth: 'jwt' },
        handler: require('../controllers/tasks').disconnectProject,
    },
    {
        method: 'PUT',
        path: '/api/tasks/position',
        config: { auth: 'jwt' },
        handler: require('../controllers/tasks').updatePositions,
    },
];
