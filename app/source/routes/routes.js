/**
 * Routing definition
 */
const routes = [
    {
        path: '/',
        _component: 'AppView',
        _checkAuth: false,
        indexRoute: {
            _component: 'MainView',
        },
        childRoutes: [
            {
                path: 'profile',
                _component: 'ProfileView',
            },
            {
                path: 'settings',
                _component: 'SettingsView',
            },
            {
                path: 'tasks',
                _component: 'TasksView',
                childRoutes: [
                    {
                        path: ':taskId',
                        _component: 'SingleTaskView',
                    },
                ],
            },
            {
                path: 'scrum',
                _component: 'ScrumView',
            },
            {
                path: 'projects',
                _component: 'ProjectsView',
            },
            {
                path: 'login',
                _component: 'LoginView',
                _checkAuth: false,
            },
            {
                path: 'signup',
                _component: 'SignupView',
                _checkAuth: false,
            },
        ],
    },
    {
        path: '/',
        _redirect: true,
    },
    {
        path: '*',
        _component: 'AppView',
        _checkAuth: false,
        indexRoute: {
            _component: 'RouteNotFoundView',
            _checkAuth: false,
        },
    },
];

module.exports = {
    routes,
};
