import {Component} from 'angular2/core';

@Component({
    selector: 'pm-app',
    directives: [],
    template: `
        <div class="row">
            <div class="col-sm-6">
                Project Management
            </div>
            <div class="col-sm-6">
                :)
            </div>
        </div>
    `
})
export class ProjectManagement {
    constructor() {}
}
