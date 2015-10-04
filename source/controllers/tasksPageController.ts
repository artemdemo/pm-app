module pmApp {

    class tasksPageController {
        public static $inject = [
            '$scope',
            '$modal',
            'tasksService',
            'taskModalHtmlLinkConstant',
            'taskModalControllerConstant'
        ];

        public tasks;

        constructor (
            public $scope,
            public $modal,
            public tasksService,
            public taskModalHtmlLinkConstant,
            public taskModalControllerConstant
        ) {

            tasksService.getTasks()
                .then(
                    (newTasks) => this.tasks = newTasks,
                    (newTasks) => this.tasks = newTasks
                );
        }

        /**
         * Open modal to create new task
         */
        public newTask () {
            this.$modal.open({
                templateUrl: this.taskModalHtmlLinkConstant,
                controller: this.taskModalControllerConstant,
                resolve: {
                    task: function () {
                        return null;
                    },
                    action: function() {
                        return 'new'
                    }
                }
            });
        }
    }

    angular
        .module('pmApp')
        .controller('tasksPageController', tasksPageController)
}