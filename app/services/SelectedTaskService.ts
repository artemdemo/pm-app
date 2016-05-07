import {Subject} from 'rxjs';
import {Injectable} from '@angular/core';
import {TasksService, ITask} from './TasksService';

export interface ISelectedTaskService {
    task: Subject<ITask>;
    setSelectedTask(taskId: Number): void;
    dropSelectedTask(): void;
    setNewTask(): void;
    refreshTask(): void;
}

@Injectable()
export class SelectedTaskService implements ISelectedTaskService {
    public task: Subject<ITask> = new Subject<ITask>();
    private _task: ITask = null;

    constructor(
        private TasksService: TasksService
    ) { }

    setSelectedTask(taskId: Number): void {
        const tasks: ITask[] = this.TasksService.getTasks();
        for (let i: number = tasks.length - 1; i > -1; i--) {
            if (tasks[i].id === taskId) {
                this._task = tasks[i];
                this.refreshTask();
                break;
            }
        }
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
