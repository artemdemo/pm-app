import {Subject} from 'rxjs';
import {Injectable} from 'angular2/core';
import {ITask, Task} from './TasksService';

export interface ISelectedTaskService {
    task: Subject<ITask>;
    setSelectedTask(newTask: ITask): void;
    updateTask(): void;
}

@Injectable()
export class SelectedTaskService implements ISelectedTaskService {
    public task: Subject<ITask> = new Subject<ITask>();
    private _task: ITask = null;

    constructor() {}

    setSelectedTask(newTask: ITask):void {
        this._task = newTask;
        this.updateTask();
    }

    updateTask(): void {
        this.task.next(this._task);
    }
}
