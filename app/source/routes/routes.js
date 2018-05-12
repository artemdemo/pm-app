/**
 * Routing definition
 */
const routes = [
    {
        path: '/',
        _component: 'AppView',
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
            },
            {
                path: 'signup',
                _component: 'SignupView',
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
        indexRoute: {
            _component: 'RouteNotFoundView',
        },
    },
];

module.exports = {
    routes,
};
