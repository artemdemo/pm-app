module.exports = [
    {
        method: 'GET',
        path: '/tasks',
        config: { auth: false },
        handler: require('../controllers/tasks').index,
    },
    {
        method: 'GET',
        path: '/tasks/all',
        config: { auth: 'jwt' },
        handler: require('../controllers/tasks').all,
    },
    {
        method: 'POST',
        path: '/tasks',
        config: { auth: 'jwt' },
        handler: require('../controllers/tasks').add,
    },
    {
        method: 'PUT',
        path: '/tasks',
        config: { auth: 'jwt' },
        handler: require('../controllers/tasks').update,
    },
    {
        method: 'DELETE',
        path: '/tasks/{taskId}',
        config: { auth: 'jwt' },
        handler: require('../controllers/tasks').delete,
    },
    {
        method: 'GET',
        path: '/tasks/{taskId}/project/{projectId}',
        config: { auth: 'jwt' },
        handler: require('../controllers/tasks').connectProject,
    },
    {
        method: 'DELETE',
        path: '/tasks/{taskId}/project/{projectId}',
        config: { auth: 'jwt' },
        handler: require('../controllers/tasks').disconnectProject,
    },
    {
        method: 'PUT',
        path: '/tasks/position',
        config: { auth: 'jwt' },
        handler: require('../controllers/tasks').updatePositions,
    },
];
