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
            if ( action == 'new' ) {
                this.taskEditCopy = tasksService.getEmptyTask();
            } else {
                this.taskEditCopy = angular.copy(task);
            }
        }

        public edit() {
            this.action = 'edit';
        }

        public cancel () {
            this.$modalInstance.dismiss('cancel');
        }

    }

    angular
        .module('pmApp')
        .controller('taskModalController', taskModalController)
}