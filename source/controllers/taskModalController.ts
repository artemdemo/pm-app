module pmApp {

    class taskModalController {
        public static $inject = [
            '$scope',
            '$modalInstance',
            'tasksService',
            'task',
            'action'
        ];

        public tasks;

        constructor (public $scope, public $modalInstance, public tasksService, public task, public action) {
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