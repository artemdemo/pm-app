import {Subject} from 'rxjs';
import {Injectable, Inject} from 'angular2/core';
import {TasksService, ITasksService, ITask} from './TasksService';

export interface ISelectedTaskService {
    task: Subject<ITask>;
    setSelectedTask(newTask: ITask): void;
    dropSelectedTask(): void;
    setNewTask(): void;
    refreshTask(): void;
}

@Injectable()
export class SelectedTaskService implements ISelectedTaskService {
    public task: Subject<ITask> = new Subject<ITask>();
    private _task: ITask = null;

    constructor(@Inject(TasksService) private TasksService: ITasksService) {}

    setSelectedTask(newTask: ITask): void {
        this._task = newTask;
        this.refreshTask();
    }

    setNewTask(): void {
        this._task = this.TasksService.getEmptyTask();
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
