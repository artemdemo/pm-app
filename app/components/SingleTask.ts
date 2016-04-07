import {Component, Inject} from 'angular2/core';
import {Task, ITask} from '../services/TasksService';
import {SelectedTaskService, ISelectedTaskService} from '../services/SelectedTaskService';
import {TasksService, ITasksService} from '../services/TasksService';
import {LoadingSpinner} from './LoadingSpinner';

@Component({
    selector: 'single-task',
    directives: [LoadingSpinner],
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
                <div class="form-group text-muted" *ngIf="task.added">
                    <p>Task Added: {{ task.added }}</p>
                    <p>Last updated: {{ task.updated }}</p>
                </div>
                <div class="clearfix">
                    <div class="pull-left">
                        <button type="submit" class="btn btn-primary">
                            <span *ngIf="!task.id">Add new</span>
                            <span *ngIf="task.id">Save</span>
                        </button>
                        <span class="btn btn-default" (click)="cancel()">Cancel</span>
                        <loading-spinner></loading-spinner>
                    </div>
                    <div class="pull-right">
                        <span class="btn btn-link btn-link_danger"
                              *ngIf="!showDelete"
                              (click)="showDeleteButtons()">Delete</span>
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
export default class SingleTask {
    private task: ITask;
    private taskModel;
    private taskSubscription;
    private showDelete: boolean = false;

    constructor(
        @Inject(SelectedTaskService) private SelectedTaskService: ISelectedTaskService,
        @Inject(TasksService) private TasksService: ITasksService
    ) {
        this.taskSubscription = SelectedTaskService.task.subscribe(newTask => {
            if (newTask) {
                this.task = newTask;
                this.taskModel = new Task(newTask);
            } else {
                this.taskModel = null;
                this.task = null;
            }
        });
    }

    submitTask() {
        if (this.taskModel.name) {
            if (this.task.id) {
                this.TasksService.updateTask(Object.assign(this.task, this.taskModel)).then(() => {
                    this.SelectedTaskService.dropSelectedTask();
                });
            } else {
                this.TasksService.addTask(Object.assign(this.task, this.taskModel)).then(() => {
                    this.SelectedTaskService.dropSelectedTask();
                });
            }
        }
    }

    showDeleteButtons = () => this.showDelete = true;
    hideDeleteButtons = () => this.showDelete = false;

    deleteTask() {
        this.TasksService.deleteTask(this.task.id).then(() => {
            this.SelectedTaskService.dropSelectedTask();
        });
    };

    cancel() {
        this.SelectedTaskService.dropSelectedTask();
    }

    ngOnDestroy() {
        this.taskSubscription.dispose();
    }
}
