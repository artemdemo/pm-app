import {Component, Input, Inject} from 'angular2/core';
import {ProjectsService, IProjectsService, IProject} from '../../services/ProjectsService';
import {SelectedProjectService, ISelectedProjectService} from '../../services/SelectedProjectService';

@Component({
    selector: 'projects-list-item',
    directives: [],
    template: `
        <div class="projects-list-item" (click)="selectTask()">
            <div class="projects-list-item__title">
                {{ project.name }}
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
        this.SelectedProjectService.setSelectedProject(this.project);
    }

    ngOnDestroy(): void {
        this.selectedProjectSubscription.unsubscribe();
    }
}
