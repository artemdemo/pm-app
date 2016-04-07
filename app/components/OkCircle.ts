import {Component} from 'angular2/core';

@Component({
    selector: 'ok-circle',
    directives: [],
    template: `
        <span class="ok-circle">
            <span class="glyphicon glyphicon-ok-circle" aria-hidden="true"></span>
        </span>
    `
})
export default class OkCircle {
    constructor() {}
}
