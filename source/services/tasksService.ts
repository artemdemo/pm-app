module pmApp {

    class tasksService {

        public static $inject = [
            '$http',
            '$q',
            'apiService'
        ];

        private tasks: Task[] = [];

        private tasksLoadingPromise = null;

        constructor(public $http, public $q, public apiService) {}

        /**
         * Function will update tasks list.
         * It will replace tasks with the same id; if task has unique id it will be added to the list
         * @param newTasks
         */
        private updateTasks( newTasks: Task[] ) {
            let tasks:Task[] = [];

            for (var i = 0, len = newTasks.length; i < len; i++) {
                let task = newTasks[i];
                let date = moment(task.created_at);
                task.created_at = {
                    date: date.format('YYYY-MM-DD'),
                    time: date.format('HH:mm'),
                    raw: date
                };
                tasks.push(task);
            }

            this.tasks = tasks;
        }

        /**
         * Load all open tasks that user have access to them
         * Open tasks ara tasks that NOT DONE and NOT CLOSED
         * @returns {promise}
         */
        public loadOpenTasks() {
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
        public getTasks() {
            let deferred = this.$q.defer();

            this.$q.all([
                this.tasksLoadingPromise
            ]).then(
                () => deferred.resolve(this.tasks),
                () => deferred.resolve(this.tasks)
            );

            return deferred.promise;
        }

        /**
         * Return empty task data
         * It will be used in modal
         */
        public getEmptyTask(): Task {
            let newTask:Task;
            let date:moment.Moment = moment(new Date());

            newTask = <Task>{
                name: '',
                created_at: {
                    date: date.format('YYYY-MM-DD'),
                    time: date.format('HH:mm'),
                    raw: date
                },
                sp: null,
                description: ''
            };

            return angular.copy(newTask);
        }
    }

    angular
        .module('pmApp')
        .service('tasksService', tasksService);
}