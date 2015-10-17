/// <reference path="./d.ts/angularjs/angular.d.ts" />

namespace pmApp {
    angular
        .module('pmApp')
        .run(['tasksService', 'projectsService', (tasksService, projectsService)=>{
            tasksService.loadOpenTasks();
            projectsService.loadOpenProjects();
        }]);
}