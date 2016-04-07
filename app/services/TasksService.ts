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
    addTask(task: ITask): void;
    updateTask(task: ITask): void;
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

    addTask(task: ITask): void {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        this.Http.post('/tasks/add', JSON.stringify(task), {
            headers: headers
        }).subscribe((res) => {
            this._tasks.push(Object.assign(task, res.json()));
            this.refreshTasks();
        });
    }

    updateTask(task: ITask): void {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        this.Http.put('/tasks/update', JSON.stringify(task), {
            headers: headers
        }).subscribe((res) => {
            for (var i = 0, len = this._tasks.length; i < len; i++) {
                if (this._tasks[i].id == task.id) {
                    this._tasks[i] = task;
                    this.refreshTasks();
                    break;
                }
            }
            this.refreshTasks();
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
