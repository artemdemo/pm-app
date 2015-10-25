namespace pmApp {
    'use strict';

    export interface ITask {
        id: any;
        priority: any;
        sp: any;
        status: any;
        name: string;
        project: any;
        parent: any;
        subtasks?: ITask[];
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

        private tasks: ITask[] = [];
        private tasksLoadingPromise: angular.IPromise<ITask[]>;

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
        public loadOpenTasks(): angular.IPromise<ITask[]> {
            let deferred: angular.IDeferred<ITask[]> = this.$q.defer();

            this.$http.get(this.apiService.getAbsoluteUrl('/tasks/open'))
                .then(
                    (result: angular.IHttpPromiseCallbackArg<any>) => {
                        if (!result.data.hasOwnProperty('ErrorStatus') || result.data.ErrorStatus === 0) {
                            deferred.resolve();
                            this.updateTasks(<ITask[]>result.data);
                        } else {
                            deferred.reject();
                        }
                    },
                    () => deferred.reject()
                );

            this.tasksLoadingPromise = deferred.promise;

            return deferred.promise;
        }


        /**
         * Return promise of loading tasks.
         * Useful to check whether tasks are loading or not.
         *
         * @returns {angular.IPromise<ITask[]>}
         */
        public getTasksLoadingPromise(): angular.IPromise<ITask[]> {
            return this.tasksLoadingPromise;
        }


        /**
         * Return all tasks
         * @returns {promise}
         */
        public getTasks(): angular.IPromise<ITask[]> {
            let deferred: angular.IDeferred<ITask[]> = this.$q.defer();

            this.$q.all([
                this.tasksLoadingPromise
            ]).then(
                () => deferred.resolve(this.tasks.map((task: ITask) => {
                    task.subtasks = (<ITask[]> this.getTasksByParent(task.id));
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
         * @returns {ITask[]}
         */
        public getTasksByParent(parentId: number): ITask[] {
            return this.tasks.filter((task: ITask) => task.parent === parentId);
        }


        /**
         * Return tasks that related to given project
         *
         * @param projectId
         * @returns {ITask[]}
         */
        public getTasksByProject(projectId: number): ITask[] {
            return this.tasks.filter((task: ITask) => task.project === projectId);
        }


        /**
         * Return empty task data
         * It will be used in modal
         *
         * @returns {IPromise<ITask>}
         */
        public getEmptyTask(): angular.IPromise<ITask> {
            let newTask: ITask;
            let date: moment.Moment = moment(new Date());
            let deferred: angular.IDeferred<ITask> = this.$q.defer();

            newTask = <ITask>{
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
                (values: any) => {
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
         * @param task {ITask}
         * @param subtasks {ITask}
         * @returns {promise}
         */
        public saveTask(task: ITask, subtasks: ITask[]): angular.IPromise<gIOresponce> {
            let deferred: angular.IDeferred<gIOresponce> = this.$q.defer();

            task.subtasks = subtasks.map((task: ITask) => task.id);

            if ( task.id ) {
                this.$http.put(
                    this.apiService.getAbsoluteUrl('/tasks'),
                    task
                ).then(
                    (result: angular.IHttpPromiseCallbackArg<gIOresponce>) => {
                        if (!result.data.hasOwnProperty('ErrorStatus') || result.data.ErrorStatus === 0) {
                            this.updateTasks(task, subtasks);
                            deferred.resolve();
                        } else {
                            deferred.reject();
                        }
                    },
                    () => deferred.reject()
                );
            } else {
                this.$http.post(
                    this.apiService.getAbsoluteUrl('/tasks'),
                    task
                ).then(
                    (result: angular.IHttpPromiseCallbackArg<gIOresponce>) => {
                        if (!result.data.hasOwnProperty('ErrorStatus') || result.data.ErrorStatus === 0) {
                            task.id = result.data.id;
                            this.updateTasks(task, subtasks);
                            deferred.resolve();
                        } else {
                            deferred.reject();
                        }
                    },
                    () => deferred.reject()
                );
            }

            return deferred.promise;
        }


        /**
         * Delete task
         *
         * @param task {ITask}
         * @param removeSubtasks {boolean}
         * @returns {promise}
         */
        public deleteTask(task: ITask, removeSubtasks: boolean = false): angular.IPromise<gIOresponce> {
            let deferred: angular.IDeferred<gIOresponce> = this.$q.defer();

            let url: string = '/tasks/task/' + task.id;
            url += removeSubtasks ? '/true' : '';

            if ( task.id ) {
                this.$http.delete(
                    this.apiService.getAbsoluteUrl(url)
                ).then(
                    (result: angular.IHttpPromiseCallbackArg<gIOresponce>) => {
                        if (!result.data.hasOwnProperty('ErrorStatus') || result.data.ErrorStatus === 0) {
                            for (var i: number = this.tasks.length - 1; i >= 0; i--) {
                                if (this.tasks[i].id === task.id) {
                                    this.tasks.splice(i, 1);
                                }
                                if (this.tasks[i].parent === task.id) {
                                    if (!removeSubtasks) {
                                        this.tasks[i].parent = null;
                                    } else {
                                        this.tasks.splice(i, 1);
                                    }
                                }
                            }
                            deferred.resolve();
                        } else {
                            deferred.reject();
                        }
                    },
                    () => deferred.reject()
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
         * @param subtasks
         */
        private updateTasks(newTasks: ITask | ITask[], subtasks?: ITask[]): void {
            let tasksArr: ITask[] = [];

            if (angular.isArray(newTasks)) {
                tasksArr = <ITask[]>newTasks;
            } else {
                tasksArr.push(<ITask>newTasks);
            }

            tasksArr.forEach((task: ITask) => {
                let taskExists: boolean = false;
                for (var i: number = 0, len: number = this.tasks.length; i < len; i++) {
                    if (this.tasks[i].id === task.id) {
                        taskExists = true;
                        this.tasks[i] = this.convertTask(task);
                    }
                    if (! angular.isDefined(subtasks) || subtasks.length === 0) {
                        if (this.tasks[i].parent === task.id) {
                            this.tasks[i].parent = null;
                        }
                    } else {
                        for (var j: number = subtasks.length - 1; j >= 0; j--) {
                            if (subtasks[j].id === this.tasks[i].id) {
                                this.tasks[i].parent = task.id;
                                subtasks.splice(j, 1);
                            }
                        }
                    }
                }

                if (!taskExists) {
                    this.tasks.push(this.convertTask(task));
                }
            });

            this.tasks = this.tasks
                .sort((taskA: ITask, taskB: ITask) => parseInt(taskB.id, 10) - parseInt(taskA.id, 10));

        }

        /**
         * Convert task to fit data to what used in front end model
         * @param task
         * @returns {Task}
         */
        private convertTask(task: ITask): ITask {
            let date: moment.Moment = angular.isString(task.created_at) ? moment(task.created_at) : task.created_at.raw;

            task.sp = parseInt(task.sp, 10);
            task.created_at = {
                date: date.format('YYYY-MM-DD'),
                time: date.format('HH:mm'),
                raw: date
            };

            return task;
        }

    }

    angular
        .module('pmApp')
        .service('tasksService', TasksService);
}
