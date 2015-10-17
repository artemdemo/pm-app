namespace pmApp {
    'use strict';

    class ProjectModalController {
        public static $inject: string[] = [
            '$scope',
            '$modalInstance',
            'tasksService',
            'projectsService',
            'project',
            'action'
        ];

        public projectEditCopy: Project;
        public selectedTask: Task;
        public availableTasks: Task[] = [];

        /**
         *
         * @param $scope
         * @param $modalInstance
         * @param tasksService
         * @param projectsService
         * @param project
         * @param action {string} - will contain action that user want apply on the project
         *      Possible values:
         *      'new' - adding new project
         *      'edit' - editing project
         *      'open' - viewing project data
         */
        constructor (
            public $scope: angular.IScope,
            public $modalInstance: any,
            public tasksService: any,
            public projectsService: any,
            public project: Project,
            public action: string
        ) {

            if ( action === 'new' ) {
                this.projectEditCopy = projectsService.getEmptyProject();
            } else {
                this.projectEditCopy = angular.copy(project);
            }

            tasksService.getTasks()
                .then((tasks: Task[]) => this.availableTasks = tasks);

        }

        public edit(): void {
            this.action = 'edit';
        }

        public cancel(): void {
            this.$modalInstance.dismiss('cancel');
        }

    }

    angular
        .module('pmApp')
        .controller('projectModalController', ProjectModalController);
}
