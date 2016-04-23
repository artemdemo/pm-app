import {Component, Inject} from 'angular2/core';
import {ProjectsList} from '../components/ProjectsList/ProjectsList';

@Component({
    selector: 'projects-page',
    directives: [ProjectsList],
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
    `
})
export class ProjectsPage {
    private openSingleProject = false;

    constructor() {}

    //ngOnDestroy() {}
}
