namespace pmApp {
    'use strict';

    class TaskModalController {
        public static $inject: string[] = [
            '$scope',
            '$modalInstance',
            'tasksService',
            'task',
            'action'
        ];

        public taskEditCopy: Task;

        public canBeDeleted: Boolean;

        public subtasks: Task[] = [];
        public selectedSubtask: Task;
        public availableTasks: Task[] = [];

        /**
         *
         * @param $scope
         * @param $modalInstance
         * @param tasksService
         * @param task
         * @param action {string} - will contain action that user want apply on the task
         *      Possible values:
         *      'new' - adding new task
         *      'edit' - editing task
         *      'open' - viewing task data
         */
        constructor (
            public $scope: angular.IScope,
            public $modalInstance: any,
            public tasksService: any,
            public task: any,
            public action: string
        ) {

            this.canBeDeleted = true;

            if ( action === 'new' ) {
                this.taskEditCopy = tasksService.getEmptyTask();
                this.canBeDeleted = false;
            } else {
                this.taskEditCopy = angular.copy(task);
            }

            tasksService.getTasks()
                .then((tasks: Task[]) => this.availableTasks = tasks);

            $scope.$watch(() => this.selectedSubtask, (newValue) => {
                if (newValue) {
                    this.subtasks.push(newValue);
                }
            })
        }

        public cancel(): void {
            this.$modalInstance.dismiss('cancel');
        }

        public editTask(): void {
            this.action = 'edit';
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
