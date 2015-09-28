module pmApp {

    class AppConfiguration {
        public static $inject = [
            '$stateProvider',
            '$urlRouterProvider'
        ];

        constructor (private $stateProvider, private $urlRouterProvider) {
            $urlRouterProvider.otherwise('/');
            $stateProvider
                .state('home', {
                    url: '/',
                    templateUrl: 'html/dashboard.html'
                })
                .state('scrum', {
                    url: '/scrum',
                    templateUrl: 'html/scrum.html'
                })
                .state('tasks', {
                    url: '/tasks',
                    templateUrl: 'html/tasks.html'
                })
                .state('projects', {
                    url: '/projects',
                    templateUrl: 'html/projects.html'
                })
                .state('iterations', {
                    url: '/iterations',
                    templateUrl: 'html/iterations.html'
                });
        }
    }

    angular
        .module('pmApp', ['ui.router', 'mm.foundation', 'ngResource'])
        .config(AppConfiguration)
        .run(['tasksService',(tasksService)=>{
            tasksService.loadOpenTasks()
        }]);
}