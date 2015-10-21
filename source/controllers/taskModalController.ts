namespace pmApp {
    'use strict';

    export enum ModalAction {
        New,
        Edit,
        Open
    }

    class TaskModalController {
        public static $inject: string[] = [
            '$scope',
            '$modalInstance',
            'tasksService',
            'projectsService',
            'task',
            'action'
        ];

        public taskEditCopy: Task;

        public canBeDeleted: Boolean;

        public subtasks: Task[] = [];
        public selectedSubtask: Task;
        public selectedParent: Task;
        public selectedProject: Task;
        public availableTasks: Task[] = [];
        public availableProjects: Project[] = [];

        /**
         *
         * @param $scope
         * @param $modalInstance
         * @param tasksService
         * @param projectsService
         * @param task
         * @param action {string} - will contain action that user want apply on the task
         *      Possible values:
         *      'New' - adding new task
         *      'Edit' - editing task
         *      'Open' - viewing task data
         */
        constructor (
            public $scope: angular.IScope,
            public $modalInstance: any,
            public tasksService: any,
            public projectsService: any,
            public task: any,
            public action: string
        ) {

            this.canBeDeleted = true;

            if ( ModalAction[action] === ModalAction['New'] ) {
                this.taskEditCopy = tasksService.getEmptyTask();
                this.canBeDeleted = false;
            } else {

                // I want to keep tasks and subtasks separately
                this.taskEditCopy = angular.copy(task);
                this.subtasks = angular.copy(task.subtasks);

                if (this.taskEditCopy.project) {
                    projectsService.getProjectById(this.taskEditCopy.project)
                        .then((project) => this.selectedProject = project);
                }
            }

            tasksService.getTasks()
                .then((tasks: Task[]) => this.availableTasks = tasks);

            projectsService.getProjects()
                .then((projects: Project[]) => this.availableProjects = projects);

            $scope.$watch(() => this.selectedSubtask, (newSubTask: Task) => {
                if (newSubTask) {
                    this.subtasks.push(newSubTask);
                }
            });

            $scope.$watch(() => this.selectedProject, (newProject: Project) => {
                if (newProject) {
                    this.taskEditCopy.project = newProject.id;
                }
            });

            $scope.$watch(() => this.selectedParent, (newParent: Task) => {
                if (newParent) {
                    this.taskEditCopy.parent = newParent.id;
                }
            });
        }

        public cancel(): void {
            this.$modalInstance.dismiss('cancel');
        }

        public editTask(): void {
            console.log(ModalAction[ModalAction.Edit]);
            this.action = ModalAction[ModalAction.Edit];
        }

        public saveTask(): void {
            this.tasksService.saveTask(this.taskEditCopy, this.subtasks);
        }

        public deleteTask(): void {
            this.tasksService.deleteTask(this.taskEditCopy);
        }
    }

    angular
        .module('pmApp')
        .controller('taskModalController', TaskModalController);
}
