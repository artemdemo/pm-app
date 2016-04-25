import {Component, Inject} from 'angular2/core';
import {Project, IProject} from '../../services/ProjectsService';
import {SelectedProjectService, ISelectedProjectService} from '../../services/SelectedProjectService';
import {ProjectsService, IProjectsService} from '../../services/ProjectsService';
import {LoadingSpinner} from '../LoadingSpinner';
import {DeleteBtn} from '../DeleteBtn';

@Component({
    selector: 'single-project',
    directives: [LoadingSpinner, DeleteBtn],
    template: `
        <div class="single-project">
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

    constructor(
        @Inject(SelectedProjectService) private SelectedProjectService: ISelectedProjectService,
        @Inject(ProjectsService) private ProjectsService: IProjectsService
    ) {
        this.projectSubscription = SelectedProjectService.project.subscribe(selectedProject => {
            if (selectedProject) {
                this.project = selectedProject;
                this.projectModel = new Project(selectedProject);
            } else {
                this.projectModel = null;
                this.project = null;
            }
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
        this.projectSubscription.unsubscribe();
    }
}
