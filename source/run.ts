/// <reference path="./d.ts/angularjs/angular.d.ts" />

module pmApp {
    angular
        .module('pmApp')
        .run(['tasksService', 'projectsService', (tasksService, projectsService)=>{
            tasksService.loadOpenTasks();
            projectsService.loadOpenProjects();
        }]);
}