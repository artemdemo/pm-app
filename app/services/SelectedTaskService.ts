import {Subject} from 'rxjs';
import {Injectable} from 'angular2/core';
import {ITask} from './TasksService';

export interface ISelectedTaskService {
    task: Subject<ITask>;
    setSelectedTask(newTask: ITask): void;
    dropSelectedTask(): void;
    refreshTask(): void;
}

@Injectable()
export class SelectedTaskService implements ISelectedTaskService {
    public task: Subject<ITask> = new Subject<ITask>();
    private _task: ITask = null;

    constructor() {}

    setSelectedTask(newTask: ITask):void {
        this._task = newTask;
        this.refreshTask();
    }
    
    dropSelectedTask(): void {
        this._task = null;
        this.refreshTask();
    }

    refreshTask(): void {
        this.task.next(this._task);
    }
}
