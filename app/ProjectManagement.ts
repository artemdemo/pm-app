import {Component} from '@angular/core';
import {RouteConfig, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {MainMenu} from './components/MainMenu';
import {TasksPage} from './pages/TasksPage';
import {ProjectsPage} from './pages/ProjectsPage';

@Component({
    selector: 'pm-app',
    directives: [ROUTER_DIRECTIVES, MainMenu],
    template: `
        <main-menu></main-menu>
        <div class="content-with-menu-on-top">
            <router-outlet></router-outlet>
        </div>
    `
})
@RouteConfig([
    { path: '/', component: TasksPage, as: 'TasksPage' },
    { path: '/projects', component: ProjectsPage, as: 'ProjectsPage' },
    { path: '/**', redirectTo: ['TasksPage'] }
])
export class ProjectManagement {
    constructor() {
    }
}
