namespace pmApp {
    'use strict';

    export interface IProject {
        id: any;
        name: string;
        created_at: {
            date: string;
            time: string;
            raw: moment.Moment;
        };
        subtasks?: ITask[];
        description: string;
    }

    class ProjectsService {

        public static $inject: string[] = [
            '$http',
            '$q',
            'apiService',
            'tasksService'
        ];

        private projects: IProject[] = [];
        private projectsLoadingPromise: angular.IPromise<IProject[]> = null;

        constructor(
            public $http: angular.IHttpService,
            public $q: angular.IQService,
            public apiService: any,
            public tasksService: any
        ) {}


        /**
         * Load all open projects that user have access to them
         * @returns {promise}
         */
        public loadOpenProjects(): angular.IPromise<IProject[]> {
            let deferred: angular.IDeferred<IProject[]> = this.$q.defer();

            this.$http.get(this.apiService.getAbsoluteUrl('/projects/open'))
                .then(
                (result: any) => {
                    deferred.resolve(result.data);
                    this.updateProjects(result.data);
                },
                (data: any) => deferred.reject(data)
            );

            this.projectsLoadingPromise = deferred.promise;

            return deferred.promise;
        }


        /**
         * Return all projects
         * @returns {promise}
         */
        public getProjects(): angular.IPromise<IProject[]> {
            let deferred: angular.IDeferred<IProject[]> = this.$q.defer();

            this.$q.all([
                this.projectsLoadingPromise,
                this.tasksService.getTasksLoadingPromise()
            ]).then(
                () => deferred.resolve(this.projects.map((project: IProject) => {
                    project.subtasks = this.tasksService.getTasksByProject(project.id);
                    return project;
                })),
                () => deferred.reject()
            );

            return deferred.promise;
        }


        /**
         * Return project by it's id
         * @returns {promise}
         */
        public getProjectById(projectId: number): angular.IPromise<IProject> {
            let deferred: angular.IDeferred<IProject> = this.$q.defer();

            this.$q.all([
                this.projectsLoadingPromise,
                this.tasksService.getTasksLoadingPromise()
            ]).then(
                () => {
                    for (var i: number = 0, len: number = this.projects.length; i < len; i++) {
                        if (projectId === this.projects[i].id) {
                            let project: IProject = this.projects[i];
                            project.subtasks = this.tasksService.getTasksByProject(project.id);
                            deferred.resolve(project);
                            break;
                        }
                    }
                },
                () => deferred.reject()
            );

            return deferred.promise;
        }


        /**
         * Return empty project data
         * It will be used in modal
         */
        public getEmptyProject(): IProject {
            let newProject: IProject;
            let date: moment.Moment = moment(new Date());

            newProject = <IProject>{
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

            return angular.copy(newProject);
        }


        /**
         * Save project to the DB
         *
         * @param project {IProject}
         * @param subtasks {ITask}
         * @returns {promise}
         */
        public saveProject(project: IProject, subtasks: ITask[]): angular.IPromise<gIOresponce> {
            let deferred: angular.IDeferred<gIOresponce> = this.$q.defer();

            project.subtasks = subtasks.map((task: ITask) => task.id);

            if ( project.id ) {
                this.$http.put(
                    this.apiService.getAbsoluteUrl('/projects'),
                    project
                ).then(
                    (data: gIOresponce) => deferred.resolve(data),
                    (data: gIOresponce) => deferred.reject(data)
                );
            } else {
                this.$http.post(
                    this.apiService.getAbsoluteUrl('/projects'),
                    project
                ).then(
                    (data: gIOresponce) => deferred.resolve(data),
                    (data: gIOresponce) => deferred.reject(data)
                );
            }

            return deferred.promise;
        }


        /**
         * Delete project
         *
         * @param project {IProject}
         * @returns {promise}
         */
        public deleteProject(project: IProject): angular.IPromise<gIOresponce> {
            let deferred: angular.IDeferred<gIOresponce> = this.$q.defer();

            if ( project.id ) {
                this.$http.delete(
                    this.apiService.getAbsoluteUrl('/projects/project/' + project.id)
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
         * Function will update projects list.
         * It will replace projects with the same id; if project has unique id it will be added to the list
         * @param newProjects
         */
        private updateProjects(newProjects: IProject[]): void {
            this.projects = newProjects.map((project: IProject) => {
                let date: moment.Moment = moment(project.created_at);
                project.id = parseInt(project.id, 10);
                project.created_at = {
                    date: date.format('YYYY-MM-DD'),
                    time: date.format('HH:mm'),
                    raw: date
                };

                return project;
            });
        }
    }

    angular
        .module('pmApp')
        .service('projectsService', ProjectsService);
}
