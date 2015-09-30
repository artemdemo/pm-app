module pmApp {
    class tasksService {

        public static $inject = [
            '$http',
            '$q',
            'apiService'
        ];

        private tasks = [];

        private tasksLoadingPromise = null;

        constructor(public $http, public $q, public apiService) {}

        /**
         * Function will update tasks list.
         * It will replace tasks with the same id; if task has unique id it will be added to the list
         * @param newTasks
         */
        private updateTasks( newTasks ) {
            this.tasks = newTasks;
        }

        /**
         * Load all open tasks that user have access to them
         * Open tasks ara tasks that NOT DONE and NOT CLOSED
         * @returns {promise}
         */
        loadOpenTasks() {
            let deferred = this.$q.defer();

            this.$http.get(this.apiService.getAbsoluteUrl('/tasks/open'))
                .then(
                    (result) => {
                        deferred.resolve(result.data);
                        this.updateTasks(result.data);
                    },
                    (data) => deferred.reject(data)
                );

            this.tasksLoadingPromise = deferred.promise;

            return deferred.promise;
        }

        /**
         * Return all tasks
         * @returns {promise}
         */
        getTasks() {
            let deferred = this.$q.defer();

            this.$q.all([
                this.tasksLoadingPromise
            ]).then(
                () => deferred.resolve(this.tasks),
                () => deferred.resolve(this.tasks)
            );

            return deferred.promise;
        }
    }

    angular
        .module('pmApp')
        .service('tasksService', tasksService);
}