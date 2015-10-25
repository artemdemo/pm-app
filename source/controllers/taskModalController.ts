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

        public taskEditCopy: ITask;

        public canBeDeleted: Boolean;

        public subtasks: ITask[] = [];
        public selectedSubtask: ITask;
        public selectedParent: ITask;
        public selectedProject: IProject;
        public availableTasks: ITask[] = [];
        public availableProjects: IProject[] = [];

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

            let taskEditCopyPromise: angular.IPromise<ITask> = null;

            this.canBeDeleted = true;

            if ( ModalAction[action] === ModalAction[ModalAction['New']] ) {
                taskEditCopyPromise = tasksService.getEmptyTask()
                    .then((newTask: ITask) => {
                        this.taskEditCopy = newTask;
                    });
                this.canBeDeleted = false;
            } else {

                // i want to keep tasks and subtasks separately
                this.taskEditCopy = angular.copy(task);
                this.subtasks = angular.copy(task.subtasks);

                if (this.taskEditCopy.parent) {
                    this.selectedParent = this.tasksService.getTaskById(this.taskEditCopy.parent);
                }

                if (this.taskEditCopy.project) {
                    projectsService.getProjectById(this.taskEditCopy.project)
                        .then((project: IProject) => this.selectedProject = project);
                }
            }

            $q.all([
                tasksService.getTasks(),
                taskEditCopyPromise
            ]).then((values: any) => {
                this.availableTasks = (<ITask[]> values[0])
                    .filter((task: ITask) => this.taskEditCopy.id !== task.id);
            });

            projectsService.getProjects()
                .then((projects: IProject[]) => this.availableProjects = projects);

            $scope.$watch(() => this.selectedSubtask, (newSubTask: ITask) => {
                if (newSubTask) {
                    this.subtasks.push(newSubTask);
                }
            });

            $scope.$watch(() => this.selectedProject, (newProject: IProject) => {
                if (newProject) {
                    this.taskEditCopy.project = newProject.id;
                }
            });

            $scope.$watch(() => this.selectedParent, (newParent: ITask) => {
                this.taskEditCopy.parent = newParent ? newParent.id : null;
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
