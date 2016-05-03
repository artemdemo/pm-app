import {Component, Input, Inject} from '@angular/core';
import {TasksService, ITasksService, ITask} from '../../services/TasksService';
import {SelectedTaskService, ISelectedTaskService} from '../../services/SelectedTaskService';
import {OkCircle} from '../OkCircle';

@Component({
    selector: 'tasks-list-item',
    directives: [OkCircle],
    template: `
        <div class="tasks-list-item">
            <div class="tasks-list-item__cell
                        tasks-list-item__cell_icon"
                        (click)="toggleDone()">
                <ok-circle [status]="task.done" [loading]="isLoading"></ok-circle>
            </div>
            <div class="tasks-list-item__cell" (click)="selectTask()">
                <span class="tasks-list-item__text"
                      [ngClass]="{'tasks-list-item__text_done' : task.done}">
                    {{ task.name }}
                </span>
            </div>
            <div class="tasks-list-item__cell
                        tasks-list-item__cell_icon">
                <span class="glyphicon glyphicon-triangle-right"
                      aria-hidden="true"
                      *ngIf="selectedTask && selectedTask.id == task.id"></span>
            </div>
        </div>
    `,
})
export class TasksListItem {
    @Input() task: ITask;
    private selectedTask: ITask = null;
    private isLoading: Boolean = false;
    private selectedTaskSubscription: any;

    constructor(@Inject(TasksService) private TasksService: ITasksService,
                @Inject(SelectedTaskService) private SelectedTaskService: ISelectedTaskService) {
        this.selectedTaskSubscription = SelectedTaskService.task.subscribe(newSelectedTask => {
            this.selectedTask = newSelectedTask;
        });
        SelectedTaskService.refreshTask();
    }

    toggleDone(taskId: number, done: boolean): void {
        this.isLoading = true;
        this.TasksService.setDone(this.task.id, !this.task.done)
            .then(() => {
                this.isLoading = false;
                this.selectTask();
            });
    }

    selectTask(): void {
        this.SelectedTaskService.setSelectedTask(this.task.id);
    }

    ngOnDestroy(): void {
        this.selectedTaskSubscription.unsubscribe();
    }
}
