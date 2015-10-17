namespace pmApp {
    'use strict';

    class TasksService {

        public static $inject: string[] = [
            '$http',
            '$q',
            'apiService'
        ];

        private tasks: Task[] = [];
        private tasksLoadingPromise: angular.IPromise<Task[]>;

        constructor(public $http: angular.IHttpService, public $q: angular.IQService, public apiService: any) {}

        /**
         * Load all open tasks that user have access to them
         * Open tasks ara tasks that NOT DONE and NOT CLOSED
         * @returns {promise}
         */
        public loadOpenTasks(): angular.IPromise<Task[]> {
            let deferred: angular.IDeferred<Task[]> = this.$q.defer();

            this.$http.get(this.apiService.getAbsoluteUrl('/tasks/open'))
                .then(
                    (result: any) => {
                        deferred.resolve(result.data);
                        this.updateTasks(result.data);
                    },
                    (data: any) => deferred.reject(data)
                );

            this.tasksLoadingPromise = deferred.promise;

            return deferred.promise;
        }


        /**
         * Return all tasks
         * @returns {promise}
         */
        public getTasks(): angular.IPromise<Task[]> {
            let deferred: angular.IDeferred<Task[]> = this.$q.defer();

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
            let newTask: Task;
            let date: moment.Moment = moment(new Date());

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
        public saveTask(task: Task): angular.IPromise<gIOresponce> {
            let deferred: angular.IDeferred<gIOresponce> = this.$q.defer();

            if ( task.id ) {
                this.$http.put(
                    this.apiService.getAbsoluteUrl('/tasks'),
                    task
                ).then(
                    (data: gIOresponce) => deferred.resolve(data),
                    (data: gIOresponce) => deferred.reject(data)
                );
            } else {
                this.$http.post(
                    this.apiService.getAbsoluteUrl('/tasks'),
                    task
                ).then(
                    (data: gIOresponce) => deferred.resolve(data),
                    (data: gIOresponce) => deferred.reject(data)
                );
            }

            return deferred.promise;
        }


        /**
         * Delete task
         *
         * @param task {Task}
         * @returns {promise}
         */
        public deleteTask(task: Task): angular.IPromise<gIOresponce> {
            let deferred: angular.IDeferred<gIOresponce> = this.$q.defer();

            if ( task.id ) {
                this.$http.delete(
                    this.apiService.getAbsoluteUrl('/tasks/task/' + task.id)
                ).then(
                    (data: gIOresponce) => deferred.resolve(data),
                    (data: gIOresponce) => deferred.reject(data)
                );
            } else {
                deferred.reject();
            }

            return deferred.promise;
        }


        /**
         * Function will update tasks list.
         * It will replace tasks with the same id; if task has unique id it will be added to the list
         * @param newTasks
         */
        private updateTasks(newTasks: Task[]): void {
            let tasks: Task[] = [];

            for (var i: number = 0, len: number = newTasks.length; i < len; i++) {
                let task: Task = newTasks[i];
                let date: moment.Moment = moment(task.created_at);
                task.id = parseInt(task.id, 10);
                task.priority = parseInt(task.priority, 10);
                task.sp = parseInt(task.sp, 10);
                task.status = parseInt(task.status, 10);
                task.created_at = {
                    date: date.format('YYYY-MM-DD'),
                    time: date.format('HH:mm'),
                    raw: date
                };
                tasks.push(task);
            }

            this.tasks = tasks;
        }
    }

    angular
        .module('pmApp')
        .service('tasksService', TasksService);
}
