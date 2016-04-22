import {Component, Inject} from 'angular2/core';
import {Task, ITask} from '../services/TasksService';
import {SelectedTaskService, ISelectedTaskService} from '../services/SelectedTaskService';
import {TasksService, ITasksService} from '../services/TasksService';
import {LoadingSpinner} from './LoadingSpinner';
import {OkCircle} from './OkCircle';

@Component({
    selector: 'single-task',
    directives: [LoadingSpinner, OkCircle],
    template: `
        <div class="single-task">
            <form (ngSubmit)="submitTask()" *ngIf="taskModel">
                <div class="form-group">
                    <input type="text"
                           class="flat-input"
                           placeholder="Task name"
                           [(ngModel)]="taskModel.name">
                </div>
                <div class="form-group">
                    <textarea class="flat-input" rows="3" [(ngModel)]="taskModel.description"></textarea>
                </div>
                <div class="form-group">
                    <ok-circle [status]="taskModel.done" (click)="toggleDone()">Mark done</ok-circle>
                </div>
                <div class="form-group text-muted" *ngIf="task.added">
                    <p>Task Added: {{ task.added }}</p>
                    <p>Last updated: {{ task.updated }}</p>
                </div>
                <div class="clearfix">
                    <div class="pull-left">
                        <button type="submit" class="btn btn-primary" [disabled]="loadingData">
                            <span *ngIf="!task.id">Add new</span>
                            <span *ngIf="task.id">Save</span>
                        </button>
                        <span class="btn btn-default" 
                              (click)="cancel()"
                              [ngClass]="{btn_disabled: loadingData}">Cancel</span>
                        <span class="btn btn-link" *ngIf="loadingData">
                            <loading-spinner></loading-spinner>
                        </span>
                    </div>
                    <div class="pull-right" *ngIf="task.id">
                        <span class="btn btn-link btn-link_danger"
                              *ngIf="!showDelete"
                              (click)="showDeleteButtons()"
                              [ngClass]="{btn_disabled: loadingData}">Delete</span>
                        <div class="delete-task" *ngIf="showDelete">
                            <div class="delete-task__title">Delete?</div>
                            <div class="delete-task-buttons">
                                <span class="glyphicon
                                             glyphicon-ok-sign
                                             delete-task-buttons__ok" 
                                      aria-hidden="true"
                                      (click)="deleteTask()"></span>
                                <span class="glyphicon
                                             glyphicon-remove-sign
                                             delete-task-buttons__cancel"
                                      aria-hidden="true"
                                      (click)="hideDeleteButtons()"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    `
})
export class SingleTask {
    private task: ITask;
    private taskModel;
    private taskSubscription;
    private showDelete: boolean = false;
    private loadingData: boolean = false;

    constructor(
        @Inject(SelectedTaskService) private SelectedTaskService: ISelectedTaskService,
        @Inject(TasksService) private TasksService: ITasksService
    ) {
        this.taskSubscription = SelectedTaskService.task.subscribe(selectedTask => {
            if (selectedTask) {
                this.task = selectedTask;
                this.taskModel = new Task(selectedTask);
            } else {
                this.taskModel = null;
                this.task = null;
            }
        });
    }

    submitTask() {
        if (this.taskModel.name && !this.loadingData) {
            this.loadingData = true;
            if (this.task.id) {
                this.TasksService.updateTask(Object.assign(this.task, this.taskModel))
                    .then(() => {
                        this.SelectedTaskService.dropSelectedTask();
                        this.loadingData = false;
                    }, () => this.loadingData = false);
            } else {
                this.TasksService.addTask(Object.assign(this.task, this.taskModel))
                    .then(() => {
                        this.SelectedTaskService.dropSelectedTask();
                        this.loadingData = false;
                    }, () => this.loadingData = false);
            }
        }
    }

    showDeleteButtons() {
        if (!this.loadingData) {
            this.showDelete = true;
        }
    }

    hideDeleteButtons = () => this.showDelete = false;

    deleteTask() {
        if (!this.loadingData) {
            this.loadingData = true;
            this.TasksService.deleteTask(this.task.id)
                .then(() => {
                    this.SelectedTaskService.dropSelectedTask();
                    this.loadingData = false;
                }, () => this.loadingData = false);
        }
    };

    toggleDone() {
        this.taskModel.done = !this.taskModel.done;
    }

    cancel() {
        this.SelectedTaskService.dropSelectedTask();
    }

    ngOnDestroy() {
        this.taskSubscription.unsubscribe();
    }
}
