import {Component, Inject} from 'angular2/core';
import {Task, ITask} from '../../services/TasksService';
import {SelectedTaskService, ISelectedTaskService} from '../../services/SelectedTaskService';
import {TasksService, ITasksService} from '../../services/TasksService';
import {ProjectsService, IProjectsService, IProject} from '../../services/ProjectsService';
import {LoadingSpinner} from '../LoadingSpinner';
import {OkCircle} from '../OkCircle';
import {DeleteBtn} from '../DeleteBtn';
import {DropdownList, IDropdownListItem} from '../DropdownList';
import {LabelsList, ILabelsListItem} from '../LabelsList';

@Component({
    selector: 'single-task',
    directives: [LoadingSpinner, OkCircle, DeleteBtn, DropdownList, LabelsList],
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
                <div class="form-group">
                    <labels-list [list]="selectedProjects"
                                 [delitable]="true"
                                 (onDelete)="disconnectProject($event)">
                    </labels-list>
                </div>
                <div class="form-group">
                    <dropdown-list [list]="availableProjects"
                                   placeholder="Project"
                                   (onSelect)="connectProject($event)"></dropdown-list>
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
                        <delete-btn (onDelete)="deleteTask()"></delete-btn>
                    </div>
                </div>
            </form>
        </div>
    `,
})
export class SingleTask {
    private task: ITask;
    private taskModel: Task;
    private taskSubscription: any;
    private projectsSubscription: any;
    private loadingData: boolean = false;
    private projectsList: IDropdownListItem[] = [];
    private availableProjects: IDropdownListItem[] = [];
    private selectedProjects: IProject[] = [];

    constructor(
        @Inject(SelectedTaskService) private SelectedTaskService: ISelectedTaskService,
        @Inject(TasksService) private TasksService: ITasksService,
        @Inject(ProjectsService) private ProjectsService: IProjectsService
    ) {
        this.taskSubscription = SelectedTaskService.task.subscribe(selectedTask => {
            if (selectedTask) {
                this.task = selectedTask;
                this.taskModel = new Task(selectedTask);
                this.selectedProjects = [];
                this.availableProjects = [];
                this.projectsList.forEach((project: IProject) => {
                    if (this.task.projects.indexOf(project.id) > -1) {
                        this.selectedProjects.push(project);
                    } else {
                        this.availableProjects.push(project);
                    }
                });
            } else {
                this.taskModel = null;
                this.task = null;
            }
        });
        this.projectsSubscription = ProjectsService.projects.subscribe(newProjects => {
            this.projectsList = newProjects.map((project: IProject) => {
                return {
                    id: project.id,
                    name: project.name,
                };
            });
        });
        ProjectsService.refreshProjects();
    }

    connectProject(project: IDropdownListItem): void {
        this.loadingData = true;
        this.TasksService.connectProject(this.task.id, project.id)
            .then(() => {
                this.loadingData = false;
                this.SelectedTaskService.setSelectedTask(this.task.id);
            }, () => {
                this.loadingData = false;
            });
    }

    disconnectProject(project: ILabelsListItem): void {
        this.loadingData = true;
        this.TasksService.disconnectProject(this.task.id, project.id)
            .then(() => {
                this.loadingData = false;
                this.SelectedTaskService.setSelectedTask(this.task.id);
            }, () => {
                this.loadingData = false;
            });
    }

    submitTask(): void {
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

    deleteTask(): void {
        if (!this.loadingData) {
            this.loadingData = true;
            this.TasksService.deleteTask(this.task.id)
                .then(() => {
                    this.SelectedTaskService.dropSelectedTask();
                    this.loadingData = false;
                }, () => this.loadingData = false);
        }
    }

    toggleDone(): void {
        this.taskModel.done = !this.taskModel.done;
    }

    cancel(): void {
        this.SelectedTaskService.dropSelectedTask();
    }

    ngOnDestroy(): void {
        this.taskSubscription.unsubscribe();
        this.projectsSubscription.unsubscribe();
    }
}