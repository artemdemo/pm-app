module pmApp {

    class taskListController {
        public static $inject = [
            '$scope',
            'tasksService'
        ];

        public tasks;

        constructor (public $scope, public tasksService) {
            this.tasks = tasksService.getTasks();

            $scope.$on('tasks-updated', () => {
                this.tasks = tasksService.getTasks();
            });
        }
    }

    angular
        .module('pmApp')
        .controller('taskListController', taskListController)
}