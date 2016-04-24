import {Component, Inject} from 'angular2/core';
import {ProjectsListItem} from './ProjectsListItem';
import {ProjectsService, IProjectsService, IProject} from '../../services/ProjectsService';
import {SelectedProjectService, ISelectedProjectService} from '../../services/SelectedProjectService';

@Component({
    selector: 'projects-list',
    directives: [ProjectsListItem],
    template: `
        <div class="projects-list">
            <projects-list-item [project]="project" 
                                *ngFor="#project of projects"></projects-list-item>
        </div>
        <button class="btn btn-default" (click)="addNewProject()">New Project</button>
    `,
})
export class ProjectsList {
    private projects: IProject[] = [];
    private projectsSubscription: any;

    constructor(@Inject(ProjectsService) private ProjectsService: IProjectsService,
                @Inject(SelectedProjectService) private SelectedProjectService: ISelectedProjectService) {
        this.projectsSubscription = ProjectsService.projects.subscribe(newProjects => {
            this.projects = newProjects;
        });
    }

    ngOnInit(): void {
        this.ProjectsService.refreshProjects();
    }

    addNewProject(): void {
        this.SelectedProjectService.setNewProject();
    }

    ngOnDestroy(): void {
        this.projectsSubscription.unsubscribe();
    }
}
