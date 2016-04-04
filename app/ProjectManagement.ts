import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import MainMenu from './components/MainMenu';
import TasksList from './components/TasksList';

@Component({
    selector: 'pm-app',
    directives: [ROUTER_DIRECTIVES, MainMenu],
    template: `
        <main-menu></main-menu>
        <div class="container container_with-menu-on-top">
            <router-outlet></router-outlet>
        </div>
    `
})
@RouteConfig([
    { path: '/', component: TasksList, as: 'TasksList' }
])
export class ProjectManagement {
    constructor() {
    }
}
