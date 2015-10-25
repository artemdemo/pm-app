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

        public projectEditCopy: IProject;

        public canBeDeleted: Boolean;

        public tasks: ITask[] = [];
        public selectedSubtask: ITask;
        public availableTasks: ITask[] = [];

        /**
         *
         * @param $scope
         * @param $modalInstance
         * @param tasksService
         * @param projectsService
         * @param project
         * @param action {string} - will contain action that user want apply on the project
         *      Possible values:
         *      'New' - adding new project
         *      'Edit' - editing project
         *      'Open' - viewing project data
         */
        constructor (
            public $scope: angular.IScope,
            public $modalInstance: any,
            public tasksService: any,
            public projectsService: any,
            public project: IProject,
            public action: string
        ) {

            this.canBeDeleted = true;

            if ( ModalAction[action] === ModalAction['New'] ) {
                this.projectEditCopy = projectsService.getEmptyProject();
                this.canBeDeleted = false;
            } else {
                this.projectEditCopy = angular.copy(project);
            }

            tasksService.getTasks()
                .then((tasks: ITask[]) => this.availableTasks = tasks);

            $scope.$watch(() => this.selectedSubtask, (newValue: ITask) => {
                if (newValue) {
                    this.tasks.push(newValue);
                }
            });

        }

        public edit(): void {
            this.action = ModalAction[ModalAction.Edit];
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
