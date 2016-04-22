import {Component, Inject} from 'angular2/core';
import {ProjectsList} from '../components/ProjectsList/ProjectsList';

@Component({
    selector: 'projects-page',
    directives: [],
    template: `
        Projects
        <div class="prjects-edit">
            <div class="projects-edit__projects-list">
                <projects-list></projects-list>
            </div>
            <div class="projects-edit__single-project">
                <single-project></single-project>
            </div>
        </div>
    `
})
export class ProjectsPage {

    constructor() {}

    ngOnDestroy() {}
}
