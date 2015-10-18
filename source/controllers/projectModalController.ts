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

        public canBeDeleted: Boolean;

        public tasks: Task[] = [];
        public selectedSubtask: Task;
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

            this.canBeDeleted = true;

            if ( action === 'new' ) {
                this.projectEditCopy = projectsService.getEmptyProject();
                this.canBeDeleted = false;
            } else {
                this.projectEditCopy = angular.copy(project);
            }

            tasksService.getTasks()
                .then((tasks: Task[]) => this.availableTasks = tasks);

            $scope.$watch(() => this.selectedSubtask, (newValue) => {
                if (newValue) {
                    this.tasks.push(newValue);
                }
            })

        }

        public edit(): void {
            this.action = 'edit';
        }

        public cancel(): void {
            this.$modalInstance.dismiss('cancel');
        }

        public saveProject(): void {
            this.projectsService.saveProject(this.projectEditCopy, this.tasks);
        }

        public deleteProject(): void {
            this.projectsService.deleteProject(this.projectEditCopy);
        }

    }

    angular
        .module('pmApp')
        .controller('projectModalController', ProjectModalController);
}
