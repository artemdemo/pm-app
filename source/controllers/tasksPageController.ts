module pmApp {

    class tasksPageController {
        public static $inject = [
            '$scope',
            'tasksService'
        ];

        public tasks;
        public dragControlListeners;

        constructor (public $scope, public tasksService) {

            tasksService.getTasks()
                .then(
                    (newTasks) => this.tasks = newTasks,
                    (newTasks) => this.tasks = newTasks
                );

            this.dragControlListeners = {
                accept: function (sourceItemHandleScope, destSortableScope) {return true}, //override to determine drag is allowed or not. default is true.
                itemMoved: function (event) {},
                orderChanged: function(event) {
                }.bind(this),
            };
        }
    }

    angular
        .module('pmApp')
        .controller('tasksPageController', tasksPageController)
}