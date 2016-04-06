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

export interface ITaskService {
    tasks: Subject<ITask[]>;
    updateTasks(): void;
}

export class Task {
    constructor(
        public name: string,
        public description: string,
        public done: boolean
    ) {}
}

@Injectable()
export class TasksService implements ITaskService {
    public tasks: Subject<ITask[]> = new Subject<ITask[]>();
    private _tasks: ITask[] = [];

    constructor(@Inject(Http) private Http) {
        Http.get('/tasks/all')
            .subscribe((res) => {
                this._tasks = res.json();
                this.updateTasks();
            });
    }

    updateTasks(): void {
        this.tasks.next(this._tasks);
    }
}
