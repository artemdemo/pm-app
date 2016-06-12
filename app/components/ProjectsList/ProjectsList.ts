import {Component} from '@angular/core';
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
export class ProjectsList {
    private projects: IProject[] = [];
    private projectsSubscription: any;

    constructor(
        private projectsService: ProjectsService,
        private SelectedProjectService: SelectedProjectService
    ) {
        this.projectsSubscription = projectsService.projects.subscribe(newProjects => {
            this.projects = newProjects;
        });
    }

    ngOnInit(): void {
        this.projectsService.refreshProjects();
    }

    addNewProject(): void {
        this.SelectedProjectService.setNewProject();
    }

    ngOnDestroy(): void {
        this.projectsSubscription.unsubscribe();
    }
}
