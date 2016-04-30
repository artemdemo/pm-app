import {Http, Headers} from 'angular2/http';
import {Subject} from 'rxjs';
import {Injectable, Inject} from 'angular2/core';

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

    constructor(@Inject(Http) private Http: Http) {
        this.loadProjects();
    }

    loadProjects(): Promise<{}> {
        return new Promise((resolve, reject) => {
            this.Http.get('/projects/all')
                .subscribe((res) => {
                    this._projects = res.json();
                    this.refreshProjects();
                    resolve();
                });
        });
    }

    addProject(project: IProject): Promise<{}> {
        let headers: Headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return new Promise((resolve, reject) => {
            this.Http.post('/projects', JSON.stringify(project), {
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

        return new Promise((resolve, reject) => {
            this.Http.put('/projects', JSON.stringify(project), {
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
        return new Promise((resolve, reject) => {
            this.Http.delete(`/projects/${projectId}`).subscribe((res) => {
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
        return new Promise((resolve, reject) => {
            this.Http.get(`/tasks/${taskId}/project/${projectId}`).subscribe((res) => {
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
        return new Promise((resolve, reject) => {
            this.Http.delete(`/tasks/${taskId}/project/${projectId}`).subscribe((res) => {
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
