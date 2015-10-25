namespace pmApp {
    'use strict';

    export interface Task {
        id: any;
        priority: any;
        sp: any;
        status: any;
        name: string;
        project: any;
        parent: any;
        subtasks?: Task[];
        created_at: {
            date: string;
            time: string;
            raw: moment.Moment;
        };
        description: string;
    }


    class TasksService {

        public static $inject: string[] = [
            '$http',
            '$q',
            'settingsService',
            'apiService'
        ];

        private tasks: Task[] = [];
        private tasksLoadingPromise: angular.IPromise<Task[]>;

        constructor(
            public $http: angular.IHttpService,
            public $q: angular.IQService,
            public settingsService: any,
            public apiService: any
        ) {}

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

            newTasks.forEach((task: Task) => {
                let taskExists = false;
                for (var i: number = 0, len: number = this.tasks.length; i<len; i++) {
                    if (this.tasks[i].id == task.id) {
                        taskExists = true;
                        this.tasks[i] = this.convertTask(task)
                    }
                }

                if (!taskExists) {
                    this.tasks.push(this.convertTask(task));
                }
            });

            this.tasks = this.tasks
                .sort((taskA: Task, taskB: Task) => parseInt(taskB.id, 10) - parseInt(taskA.id, 10));

        }

        private convertTask(task: Task): Task {
            let date: moment.Moment = angular.isString(task.created_at) ? moment(task.created_at) : task.created_at.raw;

            task.sp = parseInt(task.sp, 10);
            task.created_at = {
                date: date.format('YYYY-MM-DD'),
                time: date.format('HH:mm'),
                raw: date
            };

            return task
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
                    task.subtasks = (<Task[]> this.getTasksByParent(task.id));
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
         * @returns {IPromise<Task>}
         */
        public getEmptyTask(): angular.IPromise<Task> {
            let newTask: Task;
            let date: moment.Moment = moment(new Date());
            let deferred: angular.IDeferred<Task> = this.$q.defer();

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

            this.$q.all([
                this.settingsService.getMetatag(EMetatag.priority),
                this.settingsService.getMetatag(EMetatag.status)
            ]).then(
                (values) => {
                    newTask.priority = values[0][0].id;
                    newTask.status = values[1][0].id;
                    deferred.resolve(angular.copy(newTask));
                },
                () => deferred.reject()
            );

            return deferred.promise;
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
                    (result: angular.IHttpPromiseCallbackArg<gIOresponce>) => deferred.resolve(result.data ),
                    (result: angular.IHttpPromiseCallbackArg<gIOresponce>) => deferred.reject(result.data)
                );
            } else {
                this.$http.post(
                    this.apiService.getAbsoluteUrl('/tasks'),
                    task
                ).then(
                    (result: angular.IHttpPromiseCallbackArg<gIOresponce>) => {
                        console.log(result);
                        task.id = result.data.id;
                        this.updateTasks([task]);
                        deferred.resolve(result.data)
                    },
                    (result: angular.IHttpPromiseCallbackArg<gIOresponce>) => deferred.reject(result.data)
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
