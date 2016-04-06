import {Observable} from 'rxjs/Observable';
import {Injectable} from 'angular2/core';
import {ITask} from './TasksService';
//import 'rxjs/add/operator/map';

export interface ISelectedTaskService {
    task: Observable<ITask>;
    setSelectedTask(newTask: ITask): void;
    updateTask(): void;
}

@Injectable()
export class SelectedTaskService implements ISelectedTaskService {
    public task: Observable<ITask> = null;
    private _taskObserver: any;
    private _task: ITask = null;

    constructor() {
        this.task = new Observable(observer =>
            this._taskObserver = observer);
    }

    setSelectedTask(newTask: ITask):void {
        this._task = newTask;
        this.updateTask();
    }

    updateTask(): void {
        this._taskObserver.next(this._task);
    }
}
