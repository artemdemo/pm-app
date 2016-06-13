import {Http, Headers} from '@angular/http';
import {Subject} from 'rxjs';
import {Injectable} from '@angular/core';
import {AuthorizationService} from './AuthorizationService';

export interface IProject {
    id: number;
    name: string;
    description: string;
    tasks: number[];
    added: string;
    updated: string;
}

export interface IProjectsService {
    projects: Subject<IProject[]>;
    loadProjects(): Promise<{}>;
    addProject(project: IProject): Promise<{}>;
    updateProject(project: IProject): Promise<{}>;
    deleteProject(projectId: number): Promise<{}>;
    refreshProjects(): void;
    getEmptyProject(): IProject;
    connectTask(taskId: number, projectId: number): Promise<{}>;
    disconnectTask(taskId: number, projectId: number): Promise<{}>;
    getProjects(): IProject[];
}

// Model for form
export class Project {
    public name: string;
    public description: string;
    public tasks: number[];

    constructor(newProject: IProject) {
        this.name = newProject.name;
        this.tasks = newProject.tasks;
        this.description = newProject.description;
    }
}

@Injectable()
export class ProjectsService implements IProjectsService {
    public projects: Subject<IProject[]> = new Subject<IProject[]>();
    private _projects: IProject[] = [];
    private projectsLoading: boolean = false;

    constructor(
        private http: Http,
        private authorizationService: AuthorizationService
    ) {
        this.loadProjects();
    }

    loadProjects(): Promise<{}> {
        let headers: Headers = new Headers();
        headers.append('authorization', this.authorizationService.getToken());

        return new Promise((resolve, reject) => {
            if (this.projectsLoading) {
                resolve();
                return;
            }
            this.projectsLoading = true;
            this.http.get('/projects/all', {
                headers: headers,
            })
                .subscribe((res) => {
                    this._projects = res.json();
                    this.refreshProjects();
                    resolve();
                    this.projectsLoading = false;
                }, (error) => {
                    if (error.status === 401) {
                        this.authorizationService.unauthorizedError();
                    }
                    this.projectsLoading = false;
                });
        });
    }

    addProject(project: IProject): Promise<{}> {
        let headers: Headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('authorization', this.authorizationService.getToken());

        return new Promise((resolve, reject) => {
            this.http.post('/projects', JSON.stringify(project), {
                headers: headers,
            }).subscribe((res) => {
                this._projects.push(Object.assign(project, res.json()));
                this.refreshProjects();
                resolve();
            }, () => {
                reject();
            });
        });
    }

    updateProject(project: IProject): Promise<{}> {
        let headers: Headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('authorization', this.authorizationService.getToken());

        return new Promise((resolve, reject) => {
            this.http.put('/projects', JSON.stringify(project), {
                headers: headers,
            }).subscribe((res) => {
                let updated: boolean = false;
                for (let i: number = 0, len: number = this._projects.length; i < len; i++) {
                    if (this._projects[i].id === project.id) {
                        this._projects[i] = project;
                        this.refreshProjects();
                        updated = true;
                        resolve();
                        break;
                    }
                }
                if (!updated) {
                    reject();
                }
            }, () => {
                reject();
            });
        });
    }

    deleteProject(projectId: number): Promise<{}> {
        let headers: Headers = new Headers();
        headers.append('authorization', this.authorizationService.getToken());

        return new Promise((resolve, reject) => {
            this.http.delete(`/projects/${projectId}`, {
                headers: headers,
            }).subscribe((res) => {
                let deleted: boolean = false;
                for (let i: number = this._projects.length - 1; i >= 0; i--) {
                    if (this._projects[i].id === projectId) {
                        this._projects.splice(i, 1);
                        this.refreshProjects();
                        resolve();
                        deleted = true;
                        break;
                    }
                }
                if (!deleted) {
                    reject();
                }
            }, () => {
                reject();
            });
        });
    }

    /**
     * Connect project and given task
     *
     * @param taskId {Number}
     * @param projectId {Number}
     * @return Promise<{}>
     */
    connectTask(taskId: number, projectId: number): Promise<{}> {
        let headers: Headers = new Headers();
        headers.append('authorization', this.authorizationService.getToken());

        return new Promise((resolve, reject) => {
            this.http.get(`/tasks/${taskId}/project/${projectId}`, {
                headers: headers,
            }).subscribe((res) => {
                this.loadProjects().then(() => {
                    resolve();
                }, () => {
                    reject();
                });
            }, () => {
                reject();
            });
        });
    }

    /**
     * Remove conection between task and project
     *
     * @param taskId {Number}
     * @param projectId {Number}
     * @return Promise<{}>
     */
    disconnectTask(taskId: number, projectId: number): Promise<{}> {
        let headers: Headers = new Headers();
        headers.append('authorization', this.authorizationService.getToken());

        return new Promise((resolve, reject) => {
            this.http.delete(`/tasks/${taskId}/project/${projectId}`, {
                headers: headers,
            }).subscribe((res) => {
                this.loadProjects().then(() => {
                    resolve();
                }, () => {
                    reject();
                });
            }, () => {
                reject();
            });
        });
    }

    getEmptyProject(): IProject {
        return {
            id: null,
            name: '',
            description: '',
            tasks: [],
            added: null,
            updated: null,
        };
    }

    refreshProjects(): void {
        this.projects.next(this._projects);
    }

    getProjects: any = (): IProject[] => this._projects;
}
