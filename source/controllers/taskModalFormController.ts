namespace pmApp {
    'use strict';

    class TaskModalFormController {
        public static $inject: string[] = [
            '$scope',
            '$q',
            'tasksService',
            'projectsService'
        ];

        public showErrors: Boolean = false;

        /**
         *
         * @param $scope
         * @param $q
         * @param tasksService
         * @param projectsService
         */
        constructor (
            public $scope: any,
            public $q: angular.IQService,
            public tasksService: any,
            public projectsService: any
        ) {

        }

        public saveTask(taskEditCopy, subtasks): void {
            if (this.$scope.taskForm.$valid) {
                this.tasksService.saveTask(taskEditCopy, subtasks)
                    .then(() => this.$scope.$emit('close-modal'));
            } else {
                this.showErrors = true;
            }
        }
    }

    angular
        .module('pmApp')
        .controller('taskModalFormController', TaskModalFormController);
}
