module pmApp {

    class taskModalController {
        public static $inject = [
            '$scope',
            '$modalInstance',
            'tasksService',
            'task'
        ];

        public tasks;

        constructor (public $scope, public $modalInstance, public tasksService, public task) {
        }

        public cancel () {
            this.$modalInstance.dismiss('cancel');
        }

    }

    angular
        .module('pmApp')
        .controller('taskModalController', taskModalController)
}