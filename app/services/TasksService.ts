import {Http, Headers} from 'angular2/http';
import {Subject} from 'rxjs';
import {Injectable, Inject} from 'angular2/core';

export interface ITask {
    id: number;
    name: string;
    description: string;
    done: boolean;
    added: string;
    updated: string;
}

export interface ITasksService {
    tasks: Subject<ITask[]>;
    addTask(task: ITask): Promise<{}>;
    updateTask(task: ITask): Promise<{}>;
    deleteTask(taskId: number): Promise<{}>;
    getEmptyTask(): ITask;
    refreshTasks(): void;
}

// Model for form
export class Task {
    public name: string;
    public description: string;
    public done: boolean;

    constructor(newTask: ITask){
        this.name = newTask.name;
        this.description = newTask.description;
        this.done = newTask.done;
    }
}

@Injectable()
export class TasksService implements ITasksService {
    public tasks: Subject<ITask[]> = new Subject<ITask[]>();
    private _tasks: ITask[] = [];

    constructor(@Inject(Http) private Http) {
        Http.get('/tasks/all')
            .subscribe((res) => {
                this._tasks = res.json();
                this.refreshTasks();
            });
    }

    addTask(task: ITask): Promise<{}> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return new Promise((resolve, reject) => {
            this.Http.post('/tasks', JSON.stringify(task), {
                headers: headers
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
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return new Promise((resolve, reject) => {
            this.Http.put('/tasks', JSON.stringify(task), {
                headers: headers
            }).subscribe((res) => {
                let updated = false;
                for (var i = 0, len = this._tasks.length; i < len; i++) {
                    if (this._tasks[i].id == task.id) {
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

    deleteTask(taskId: number): Promise<{}> {
        return new Promise((resolve, reject) => {
            this.Http.delete(`/tasks/${taskId}`).subscribe((res) => {
                let deleted = false;
                for (var i = this._tasks.length - 1; i >= 0; i--) {
                    if (this._tasks[i].id == taskId) {
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

    getEmptyTask(): ITask {
        return {
            id: null,
            name: '',
            description: '',
            done: false,
            added: null,
            updated: null,
        }
    }

    refreshTasks(): void {
        this.tasks.next(this._tasks);
    }
}