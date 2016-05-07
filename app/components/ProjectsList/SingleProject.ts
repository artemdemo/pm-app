import {Component, Inject} from '@angular/core';
import {TasksService, ITask, ITasksService} from '../../services/TasksService';
import {Project, IProject} from '../../services/ProjectsService';
import {SelectedProjectService, ISelectedProjectService} from '../../services/SelectedProjectService';
import {ProjectsService, IProjectsService} from '../../services/ProjectsService';
import {LoadingSpinner} from '../LoadingSpinner';
import {DeleteBtn} from '../DeleteBtn';
import {DropdownList} from '../DropdownList';
import {NarrowList} from '../NarrowList';
import {IGeneralListItem} from '../../interfaces/IGeneralListItem';

@Component({
    selector: 'single-project',
    directives: [LoadingSpinner, DeleteBtn, DropdownList, NarrowList],
    template: `
        <div class="single-panel">
            <form (ngSubmit)="submitProject()" *ngIf="projectModel">
                <div class="form-group">
                    <input type="text"
                           class="flat-input"
                           placeholder="Project name"
                           [(ngModel)]="projectModel.name">
                </div>
                <div class="form-group">
                    <textarea class="flat-input" rows="3" [(ngModel)]="projectModel.description"></textarea>
                </div>
                <div class="form-group">
                    <div class="single-panel__subtitle" *ngIf="selectedTasks.length > 0">
                        Tasks
                    </div>
                    <narrow-list [list]="selectedTasks"
                                 [delitable]="true"
                                 (onDelete)="disconnectTask($event)">
                    </narrow-list>
                </div>
                <div class="form-group">
                    <dropdown-list [list]="availableTasks"
                                   placeholder="Connect task"
                                   (onSelect)="connectTask($event)"></dropdown-list>
                </div>
                <div class="form-group text-muted" *ngIf="project.added">
                    <p>Project Added: {{ project.added }}</p>
                    <p>Last updated: {{ project.updated }}</p>
                </div>
                <div class="clearfix">
                    <div class="pull-left">
                        <button type="submit" class="btn btn-primary" [disabled]="loadingData">
                            <span *ngIf="!project.id">Add new</span>
                            <span *ngIf="project.id">Save</span>
                        </button>
                        <span class="btn btn-default"
                              (click)="cancel()"
                              [ngClass]="{btn_disabled: loadingData}">Cancel</span>
                        <span class="btn btn-link" *ngIf="loadingData">
                            <loading-spinner></loading-spinner>
                        </span>
                    </div>
                    <div class="pull-right" *ngIf="project.id">
                        <delete-btn (onDelete)="deleteProject()"></delete-btn>
                    </div>
                </div>
            </form>
        </div>
    `,
})
export class SingleProject {
    private project: IProject;
    private projectModel: Project;
    private projectSubscription: any;
    private loadingData: boolean = false;
    private tasksList: IGeneralListItem[] = [];
    private availableTasks: IGeneralListItem[] = [];
    private selectedTasks: ITask[] = [];
    private tasksSubscription: any;

    constructor(
        @Inject(SelectedProjectService) private SelectedProjectService: ISelectedProjectService,
        @Inject(TasksService) private TasksService: ITasksService,
        @Inject(ProjectsService) private ProjectsService: IProjectsService
    ) {
        this.projectSubscription = SelectedProjectService.project.subscribe(selectedProject => {
            if (selectedProject) {
                this.project = selectedProject;
                this.projectModel = new Project(selectedProject);
                this.availableTasks = [];
                this.selectedTasks = [];
                this.tasksList.forEach((task: ITask) => {
                    if (this.project.tasks.indexOf(task.id) > -1) {
                        this.selectedTasks.push(task);
                    } else {
                        this.availableTasks.push(task);
                    }
                });
            } else {
                this.projectModel = null;
                this.project = null;
            }
        });
        this.tasksSubscription = TasksService.tasks.subscribe(newTasks => {
            this.tasksList = newTasks.map((task: ITask) => {
                return {
                    id: task.id,
                    name: task.name,
                    done: task.done,
                };
            });
        });
        ProjectsService.refreshProjects();
        TasksService.refreshTasks();
    }

    connectTask(task: IGeneralListItem): void {
        this.loadingData = true;
        this.ProjectsService.connectTask(task.id, this.project.id)
            .then(() => {
                this.loadingData = false;
                this.SelectedProjectService.setSelectedProject(this.project.id);
            }, () => {
                this.loadingData = false;
            });
    }

    disconnectTask(task: IGeneralListItem): void {
        this.loadingData = true;
        this.ProjectsService.disconnectTask(task.id, this.project.id)
            .then(() => {
                this.loadingData = false;
                this.SelectedProjectService.setSelectedProject(this.project.id);
            }, () => {
                this.loadingData = false;
            });
    }

    submitProject(): void {
        if (this.projectModel.name && !this.loadingData) {
            this.loadingData = true;
            if (this.project.id) {
                this.ProjectsService.updateProject(Object.assign(this.project, this.projectModel))
                    .then(() => {
                        this.SelectedProjectService.dropSelectedProject();
                        this.loadingData = false;
                    }, () => this.loadingData = false);
            } else {
                this.ProjectsService.addProject(Object.assign(this.project, this.projectModel))
                    .then(() => {
                        this.SelectedProjectService.dropSelectedProject();
                        this.loadingData = false;
                    }, () => this.loadingData = false);
            }
        }
    }

    deleteProject(): void {
        if (!this.loadingData) {
            this.loadingData = true;
            this.ProjectsService.deleteProject(this.project.id)
                .then(() => {
                    this.SelectedProjectService.dropSelectedProject();
                    this.loadingData = false;
                }, () => this.loadingData = false);
        }
    }

    cancel(): void {
        this.SelectedProjectService.dropSelectedProject();
    }

    ngOnDestroy(): void {
        this.tasksSubscription.unsubscribe();
        this.projectSubscription.unsubscribe();
    }
}
