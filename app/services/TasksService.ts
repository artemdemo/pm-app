import {Http} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {Injectable, Inject} from 'angular2/core';
//import 'rxjs/add/operator/map';

export interface ITask {
    id: number;
    name: string;
    description: string;
    done: boolean;
    added: string;
    updated: string;
}

export interface ITaskService {
    tasks: Observable<ITask[]>;
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
    public tasks: Observable<ITask[]> = null;
    private _tasksObserver: any;
    private _tasks: ITask[] = [];

    constructor(@Inject(Http) private Http) {
        this.tasks = new Observable(observer =>
            this._tasksObserver = observer);

        Http.get('/tasks/all')
            .subscribe((res) => {
                this._tasks = res.json();
                this.updateTasks();
            });
    }

    updateTasks(): void {
        this._tasksObserver.next(this._tasks);
    }
}
