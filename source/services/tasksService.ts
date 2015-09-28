module pmApp {
    class tasksService {

        public static $inject = [
            '$http',
            '$q',
            '$rootScope',
            'apiService'
        ];

        private tasks = [];

        constructor(public $http, public $q, public $rootScope, public apiService) {}

        /**
         * Function will update tasks list.
         * It will replace tasks with the same id; if task has unique id it will be added to the list
         * @param newTasks
         */
        private updateTasks( newTasks ) {
            this.tasks = newTasks;
            this.$rootScope.$broadcast('tasks-updated');
        }

        /**
         * Load all open tasks that user have access to them
         * Open tasks ara tasks that NOT DONE and NOT CLOSED
         * @returns {promise}
         */
        loadOpenTasks() {
            let deferred = this.$q.defer();

            this.$http.get(this.apiService.getAbsoluteUrl('/tasks/open'))
                .then((result) => {
                    deferred.resolve(result.data);
                    this.updateTasks(result.data);
                },
                (data) => {
                    deferred.reject(data);
                });

            return deferred.promise;
        }

        /**
         * Return all tasks
         * @returns {Array}
         */
        getTasks() {
            return this.tasks
        }
    }

    angular
        .module('pmApp')
        .service('tasksService', tasksService);
}