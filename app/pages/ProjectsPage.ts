import {Component} from '@angular/core';
import {CanActivate, ComponentInstruction} from '@angular/router-deprecated';
import {ProjectsList} from '../components/ProjectsList/ProjectsList';
import {SingleProject} from '../components/ProjectsList/SingleProject';
import {SelectedEntityService, EntityType} from '../services/SelectedEntityService';
import {isLoggedIn} from '../services/AuthorizationService';
import {ProjectsService} from '../services/ProjectsService';

@CanActivate((next: ComponentInstruction, previous: ComponentInstruction) => {
    return isLoggedIn(next, previous);
})
@Component({
    selector: 'projects-page',
    directives: [ProjectsList, SingleProject],
    template: `
        <div class="list-container"
             [ngClass]="{'list-container_open-right-panel' : openSingleProject}">
            <div class="list-container__list">
                <projects-list></projects-list>
            </div>
            <div class="list-container__panel">
                <single-project></single-project>
            </div>
        </div>
    `,
})
export class ProjectsPage {
    private openSingleProject: boolean = false;
    private projectSubscription: any;

    constructor(
        private projectsService: ProjectsService,
        private selectedEntityService: SelectedEntityService
    ) {
        this.projectsService.loadProjects();
        this.projectSubscription = selectedEntityService.getEntitySubject(EntityType.project).subscribe(newTask => {
            this.openSingleProject = !!newTask;
        });
    }

    ngOnDestroy(): void {
        this.projectSubscription.unsubscribe();
    }
}
