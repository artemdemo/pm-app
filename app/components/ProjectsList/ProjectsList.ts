import {Component, Injectable} from '@angular/core';
import {ProjectsListItem} from './ProjectsListItem';
import {ProjectsService, IProject} from '../../services/ProjectsService';
import {SelectedProjectService} from '../../services/SelectedProjectService';

@Component({
    selector: 'projects-list',
    directives: [ProjectsListItem],
    template: `
        <div class="projects-list">
            <projects-list-item [project]="project"
                                *ngFor="let project of projects"></projects-list-item>
        </div>
        <button class="btn btn-default" (click)="addNewProject()">New Project</button>
    `,
})
@Injectable()
export class ProjectsList {
    private projects: IProject[] = [];
    private projectsSubscription: any;

    constructor(
        private ProjectsService: ProjectsService,
        private SelectedProjectService: SelectedProjectService
    ) {
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
