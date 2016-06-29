import {Component} from '@angular/core';
import {ProjectsListItem} from './ProjectsListItem';
import {ProjectsService, IProject} from '../../services/ProjectsService';
import {SelectedEntityService, EntityType} from '../../services/SelectedEntityService';

@Component({
    selector: 'projects-list',
    directives: [ProjectsListItem],
    template: `
        <h4>Active</h4>
        <div class="projects-list">
            <projects-list-item [project]="project"
                                *ngFor="let project of filterProjects('active')"></projects-list-item>
        </div>
        <h4>Other</h4>
        <div class="projects-list">
            <projects-list-item [project]="project"
                                *ngFor="let project of filterProjects('empty')"></projects-list-item>
        </div>
        <button class="btn btn-default" (click)="addNewProject()">New Project</button>
    `,
})
export class ProjectsList {
    private projects: IProject[] = [];
    private projectsSubscription: any;

    constructor(
        private projectsService: ProjectsService,
        private selectedEntityService: SelectedEntityService
    ) {
        this.projectsSubscription = projectsService.projects.subscribe(newProjects => {
            this.projects = newProjects;
        });
    }

    ngOnInit(): void {
        this.projectsService.refreshProjects();
    }

    filterProjects(filter: string): IProject[] {
        /* tslint:disable */
        switch (filter) {
            case 'active':
                return this.projects.filter((item) => item.tasks.length && item.tasks.length > 0);
            case 'empty':
                return this.projects.filter((item) => !item.tasks.length || item.tasks.length === 0);
            case 'all':
            default:
                return this.projects;
        }
        /* tslint:enable */
    }

    addNewProject(): void {
        this.selectedEntityService.setNewEntity(EntityType.project);
    }

    ngOnDestroy(): void {
        this.projectsSubscription.unsubscribe();
    }
}
