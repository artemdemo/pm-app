import {Http} from 'angular2/http';
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
    updateTask(task: ITask): void;
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

    updateTask(task: ITask): void {
        for (var i = 0, len = this._tasks.length; i < len; i++) {
            if (this._tasks[i].id == task.id) {
                this._tasks[i] = task;
                this.tasks.next(this._tasks);
                break;
            }
        }
    }

    refreshTasks(): void {
        this.tasks.next(this._tasks);
    }
}
