import {Component} from '@angular/core';
import {RouteConfig, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {LoginPage} from './pages/LoginPage';
import {SignupPage} from './pages/SignupPage';
import {ProjectManagement} from './ProjectManagement';

@Component({
    selector: 'main-router',
    directives: [ROUTER_DIRECTIVES],
    template: `
        <router-outlet></router-outlet>
    `
})
@RouteConfig([
        { path: '/...', component: ProjectManagement, name: 'ProjectManagement' },
        { path: '/login', component: LoginPage, name: 'LoginPage' },
        { path: '/signup', component: SignupPage, name: 'SignupPage' },
        { path: '/**', redirectTo: ['ProjectManagement'] }
    ])
export class MainRouter {
}
