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
                let task: Task = newTasks[i];
                let date = moment(task.created_at);
                task.id = parseInt(task.id);
                task.priority = parseInt(task.priority);
                task.sp = parseInt(task.sp);
                task.status = parseInt(task.status);
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
         *
         * @returns {Task}
         */
        public getEmptyTask(): Task {
            let newTask:Task;
            let date:moment.Moment = moment(new Date());

            newTask = <Task>{
                id: null,
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


        /**
         * Save task to the DB
         *
         * @param task {Task}
         * @returns {promise}
         */
        public saveTask(task) {
            let deferred = this.$q.defer();

            if ( task.id ) {
                this.$http.put(
                    this.apiService.getAbsoluteUrl('/tasks'),
                    task
                ).then(
                    (data) => deferred.resolve(data),
                    (data) => deferred.reject(data)
                )
            } else {
                this.$http.post(
                    this.apiService.getAbsoluteUrl('/tasks'),
                    task
                ).then(
                    (data) => deferred.resolve(data),
                    (data) => deferred.reject(data)
                )
            }

            return deferred.promise;
        }


        /**
         * Delete task
         *
         * @param task {Task}
         * @returns {promise}
         */
        public deleteTask(task: Task) {
            let deferred = this.$q.defer();

            if ( task.id ) {
                this.$http.delete(
                    this.apiService.getAbsoluteUrl('/tasks/task/' + task.id)
                ).then(
                    (data) => deferred.resolve(data),
                    (data) => deferred.reject(data)
                )
            } else {
                deferred.reject()
            }

            return deferred.promise;
        }
    }

    angular
        .module('pmApp')
        .service('tasksService', tasksService);
}