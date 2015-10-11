module pmApp {

    class taskModalController {
        public static $inject = [
            '$scope',
            '$modalInstance',
            'tasksService',
            'task',
            'action'
        ];

        public taskEditCopy: Task;

        public canBeDeleted: Boolean;

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
            public $scope,
            public $modalInstance,
            public tasksService,
            public task,
            public action
        ) {

            this.canBeDeleted = true;

            if ( action == 'new' ) {
                this.taskEditCopy = tasksService.getEmptyTask();
                this.canBeDeleted = false;
            } else {
                this.taskEditCopy = angular.copy(task);
            }
        }

        public edit() {
            this.action = 'edit';
        }

        public cancel() {
            this.$modalInstance.dismiss('cancel');
        }

        public save() {
            this.tasksService.saveTask(this.taskEditCopy);
        }

        public delete() {
            this.tasksService.deleteTask(this.taskEditCopy);
        }

    }

    angular
        .module('pmApp')
        .controller('taskModalController', taskModalController)
}