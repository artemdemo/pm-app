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
            '$q',
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
         * @param $q
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
            public $q: angular.IQService,
            public tasksService: any,
            public projectsService: any,
            public task: any,
            public action: string
        ) {

            let taskEditCopyPromise = null;

            this.canBeDeleted = true;

            if ( ModalAction[action] === ModalAction[ModalAction['New']] ) {
                taskEditCopyPromise = tasksService.getEmptyTask()
                    .then((newTask) => {
                        this.taskEditCopy = newTask;
                    });
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

            $q.all([
                tasksService.getTasks(),
                taskEditCopyPromise
            ]).then((values) => {
                this.availableTasks = (<Task[]> values[0])
                    .filter((task: Task) => this.taskEditCopy.id !== task.id)
            });

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
            this.action = ModalAction[ModalAction.Edit];
        }

        public saveTask(): void {
            this.tasksService.saveTask(this.taskEditCopy, this.subtasks)
                .then(() => this.$modalInstance.close());
        }

        public deleteTask(): void {
            this.tasksService.deleteTask(this.taskEditCopy)
                .then(() => this.$modalInstance.close());
        }
    }

    angular
        .module('pmApp')
        .controller('taskModalController', TaskModalController);
}
