module pmApp {

    class tasksPageController {
        public static $inject = [
            '$scope',
            'tasksService'
        ];

        public tasks;

        constructor (public $scope, public tasksService) {

            tasksService.getTasks()
                .then(
                    (newTasks) => this.tasks = newTasks,
                    (newTasks) => this.tasks = newTasks
                );
        }
    }

    angular
        .module('pmApp')
        .controller('tasksPageController', tasksPageController)
}