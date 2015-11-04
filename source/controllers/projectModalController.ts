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

        public subtasks: ITask[] = [];
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
            let allTasks: ITask[] = [];

            this.canBeDeleted = true;

            if ( ModalAction[action] === ModalAction['New'] ) {
                this.projectEditCopy = projectsService.getEmptyProject();
                this.canBeDeleted = false;
            } else {
                this.projectEditCopy = angular.copy(project);
                this.subtasks = this.projectEditCopy.subtasks;
            }

            let excludeUsedTasks = (tasks: ITask[], excludedItems: ITask[] = []) => tasks.
                filter((task: ITask) => {
                    for (var i: number = 0, len: number = excludedItems.length; i < len; i++) {
                        if (excludedItems[i].id === task.id) {
                            return false;
                        }
                    }
                    return true;
                });

            tasksService.getTasks()
                .then((tasks: ITask[]) => {
                    allTasks = tasks;

                    this.availableTasks = excludeUsedTasks(allTasks, this.subtasks);
                });

            $scope.$watch(() => this.subtasks.length, (len: number) => {
                this.availableTasks = excludeUsedTasks(allTasks, this.subtasks);
            });

            $scope.$watch(() => this.selectedSubtask, (newValue: ITask) => {
                if (newValue) {
                    this.subtasks.push(newValue);
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
            console.log('projectModalController -> this.availableTasks', this.availableTasks);
            // I need to compare what tasks were in lst and what are right before saving
            // Case if some of them are deleted - I need also to use them in order to update main task list
            this.projectsService.saveProject(this.projectEditCopy, this.subtasks).then(() => {
                // this.tasksService.updateTasks();
                this.$modalInstance.close();
            });
        }

        public deleteProject(): void {
            this.projectsService.deleteProject(this.projectEditCopy);
        }

    }

    angular
        .module('pmApp')
        .controller('projectModalController', ProjectModalController);
}
