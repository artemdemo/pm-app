import {Component, Input, Inject} from '@angular/core';
import {ProjectsService, IProjectsService, IProject} from '../../services/ProjectsService';
import {SelectedProjectService, ISelectedProjectService} from '../../services/SelectedProjectService';

@Component({
    selector: 'projects-list-item',
    directives: [],
    template: `
        <div class="projects-list-item"
             [ngClass]="{'projects-list-item_selected': selectedProject && selectedProject.id == project.id}"
             (click)="selectTask()">
            <div class="projects-list-item__title">
                {{ project.name }}
            </div>
            <div class="text-muted">
                Tasks: {{ project.tasks.length }}
            </div>
        </div>
    `,
})
export class ProjectsListItem {
    @Input() project: IProject;
    private selectedProject: IProject = null;
    private selectedProjectSubscription: any;

    constructor(@Inject(ProjectsService) private ProjectsService: IProjectsService,
                @Inject(SelectedProjectService) private SelectedProjectService: ISelectedProjectService) {
        this.selectedProjectSubscription = SelectedProjectService.project.subscribe(newSelectedProject => {
            this.selectedProject = newSelectedProject;
        });
    }

    selectTask(): void {
        this.SelectedProjectService.setSelectedProject(this.project.id);
    }

    ngOnDestroy(): void {
        this.selectedProjectSubscription.unsubscribe();
    }
}
