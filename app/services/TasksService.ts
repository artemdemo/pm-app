import {Http, Headers} from '@angular/http';
import {Subject} from 'rxjs';
import {Injectable} from '@angular/core';
import {AuthorizationService} from './AuthorizationService';

export interface ITask {
    id: number;
    name: string;
    description: string;
    projects: number[];
    done: boolean;
    added: string;
    updated: string;
}

export interface ITasksService {
    tasks: Subject<ITask[]>;
    addTask(task: ITask): Promise<{}>;
    updateTask(task: ITask): Promise<{}>;
    deleteTask(taskId: number): Promise<{}>;
    setDone(taskId: number, done: boolean): Promise<{}>;
    connectProject(taskId: number, projectId: number): Promise<{}>;
    disconnectProject(taskId: number, projectId: number): Promise<{}>;
    getEmptyTask(): ITask;
    refreshTasks(): void;
    getTasks(): ITask[];
}

// Model for form
export class Task {
    public name: string;
    public description: string;
    public projects: number[];
    public done: boolean;

    constructor(newTask: ITask) {
        this.name = newTask.name;
        this.description = newTask.description;
        this.projects = newTask.projects;
        this.done = newTask.done;
    }
}

@Injectable()
export class TasksService implements ITasksService {
    public tasks: Subject<ITask[]> = new Subject<ITask[]>();
    private _tasks: ITask[] = [];
    private tasksLoading: boolean = false;

    constructor(
        private http: Http,
        private authorizationService: AuthorizationService
    ) {
        this.loadTasks();
    }

    loadTasks(): Promise<{}> {
        let headers: Headers = new Headers();
        headers.append('authorization', this.authorizationService.getToken());

        return new Promise((resolve, reject) => {
            if (this.tasksLoading) {
                resolve();
                return;
            }
            this.tasksLoading = true;
            this.http.get('/tasks/all', {
                headers: headers,
            })
                .subscribe((res) => {
                    this._tasks = res.json();
                    this.refreshTasks();
                    resolve();
                    this.tasksLoading = false;
                }, (error) => {
                    if (error.status === 401) {
                        this.authorizationService.unauthorizedError();
                    }
                    this.tasksLoading = false;
                });
        });
    }

    addTask(task: ITask): Promise<{}> {
        let headers: Headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('authorization', this.authorizationService.getToken());

        return new Promise((resolve, reject) => {
            this.http.post('/tasks', JSON.stringify(task), {
                headers: headers,
            }).subscribe((res) => {
                this._tasks.push(Object.assign(task, res.json()));
                this.refreshTasks();
                resolve();
            }, () => {
                reject();
            });
        });
    }

    updateTask(task: ITask): Promise<{}> {
        let headers: Headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('authorization', this.authorizationService.getToken());

        return new Promise((resolve, reject) => {
            this.http.put('/tasks', JSON.stringify(task), {
                headers: headers,
            }).subscribe((res) => {
                let updated: boolean = false;
                for (let i: number = 0, len: number = this._tasks.length; i < len; i++) {
                    if (this._tasks[i].id === task.id) {
                        this._tasks[i] = task;
                        this.refreshTasks();
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

    setDone(taskId: number, done: boolean): Promise<{}> {
        let headers: Headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('authorization', this.authorizationService.getToken());

        return new Promise((resolve, reject) => {
            this.http.put('/tasks', JSON.stringify({
                id: taskId,
                done: done,
            }), {
                headers: headers,
            }).subscribe((res) => {
                let updated: boolean = false;
                for (let i: number = 0, len: number = this._tasks.length; i < len; i++) {
                    if (this._tasks[i].id === taskId) {
                        this._tasks[i].done = done;
                        this.refreshTasks();
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

    deleteTask(taskId: number): Promise<{}> {
        let headers: Headers = new Headers();
        headers.append('authorization', this.authorizationService.getToken());

        return new Promise((resolve, reject) => {
            this.http.delete(`/tasks/${taskId}`, {
                headers: headers,
            }).subscribe((res) => {
                let deleted: boolean = false;
                for (let i: number = this._tasks.length - 1; i >= 0; i--) {
                    if (this._tasks[i].id === taskId) {
                        this._tasks.splice(i, 1);
                        this.refreshTasks();
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
    connectProject(taskId: number, projectId: number): Promise<{}> {
        let headers: Headers = new Headers();
        headers.append('authorization', this.authorizationService.getToken());

        return new Promise((resolve, reject) => {
            this.http.get(`/tasks/${taskId}/project/${projectId}`, {
                headers: headers,
            }).subscribe((res) => {
                this.loadTasks().then(() => {
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
    disconnectProject(taskId: number, projectId: number): Promise<{}> {
        let headers: Headers = new Headers();
        headers.append('authorization', this.authorizationService.getToken());

        return new Promise((resolve, reject) => {
            this.http.delete(`/tasks/${taskId}/project/${projectId}`, {
                headers: headers,
            }).subscribe((res) => {
                this.loadTasks().then(() => {
                    resolve();
                }, () => {
                    reject();
                });
            }, () => {
                reject();
            });
        });
    }

    getEmptyTask(): ITask {
        return {
            id: null,
            name: '',
            description: '',
            projects: [],
            done: false,
            added: null,
            updated: null,
        };
    }

    refreshTasks(): void {
        this.tasks.next(this._tasks.sort((a, b) => {
            if (!a.done && b.done) {
                return -1;
            }
            if (a.done && !b.done) {
                return 1;
            }
            return 0;
        }));
    }

    getTasks: any = (): ITask[] => this._tasks;
}
