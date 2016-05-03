import {Component, Inject} from '@angular/core';
import {ProjectsList} from '../components/ProjectsList/ProjectsList';
import {SingleProject} from '../components/ProjectsList/SingleProject';
import {SelectedProjectService, ISelectedProjectService} from '../services/SelectedProjectService';

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

    constructor(@Inject(SelectedProjectService) private SelectedProjectService: ISelectedProjectService) {
        this.projectSubscription = SelectedProjectService.project.subscribe(newTask => {
            this.openSingleProject = !!newTask;
        });
    }

    ngOnDestroy(): void {
        this.projectSubscription.unsubscribe();
    }
}
