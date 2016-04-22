import {Component, Inject} from 'angular2/core';
import {ProjectsListItem} from './ProjectsListItem';

@Component({
    selector: 'projects-list',
    directives: [ProjectsListItem],
    template: `
        <div class="projects-list">
            <projects-list-item></projects-list-item>
        </div>
        <button class="btn btn-default">New Project</button>
    `
})
export class ProjectsList {
    constructor() {}

    ngOnDestroy() {}
}
