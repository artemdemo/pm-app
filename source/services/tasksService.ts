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
         * Function will update tasks list.
         * It will replace tasks with the same id; if task has unique id it will be added to the list
         * @param newTasks
         */
        private updateTasks(newTasks: Task[]): void {

            this.tasks = newTasks.map((task: Task) => {
                let date: moment.Moment = moment(task.created_at);
                let parent = parseInt(task.parent, 10);
                let project = parseInt(task.project, 10);

                task.id = parseInt(task.id, 10);
                task.priority = parseInt(task.priority, 10);
                task.sp = parseInt(task.sp, 10);
                task.status = parseInt(task.status, 10);
                task.parent = parent == parent ? parent : task.parent;
                task.project = project == project ? project : task.project;
                task.created_at = {
                    date: date.format('YYYY-MM-DD'),
                    time: date.format('HH:mm'),
                    raw: date
                };

                return task
            });
        }

        /**
         * Return promise of loading tasks.
         * Useful to check whether tasks are loading or not.
         *
         * @returns {angular.IPromise<Task[]>}
         */
        public getTasksLoadingPromise(): angular.IPromise<Task[]> {
            return this.tasksLoadingPromise;
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
                () => deferred.resolve(this.tasks.map((task: Task) => {
                    task.subtasks = this.getTasksByParent(task.id);
                    return task;
                })),
                () => deferred.reject()
            );

            return deferred.promise;
        }


        /**
         * Return tasks that related to given parent
         *
         * @param parentId
         * @returns {Task[]}
         */
        public getTasksByParent(parentId: number): Task[] {
            return this.tasks.filter((task) => task.parent === parentId);
        }


        /**
         * Return tasks that related to given project
         *
         * @param projectId
         * @returns {Task[]}
         */
        public getTasksByProject(projectId: number): Task[] {
            return this.tasks.filter((task) => task.project === projectId);
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
         * @param subtasks {Task}
         * @returns {promise}
         */
        public saveTask(task: Task, subtasks: Task[]): angular.IPromise<gIOresponce> {
            let deferred: angular.IDeferred<gIOresponce> = this.$q.defer();

            (<any> task).subtasks = subtasks.map((task) => task.id);

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

    }

    angular
        .module('pmApp')
        .service('tasksService', TasksService);
}
