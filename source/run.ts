/// <reference path="./d.ts/angularjs/angular.d.ts" />

namespace pmApp {
    angular
        .module('pmApp')
        .run([
            'tasksService', 'projectsService', 'settingsService',
            (tasksService, projectsService, settingsService) => {
                settingsService.loadSettings();
                tasksService.loadOpenTasks();
                projectsService.loadOpenProjects();
            }]);
}