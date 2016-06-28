import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';

import {AuthorizationService} from '../services/AuthorizationService';

@Component({
    selector: 'main-menu',
    directives: [ROUTER_DIRECTIVES],
    template: `
        <nav class="navbar navbar-default navbar-fixed-top">
            <div class="container">
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle collapsed">
                        <span class="sr-only">Toggle navigation</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                    <a class="navbar-brand" href="/">&lt;PM&gt;</a>
                </div>
                <div id="navbar" class="collapse navbar-collapse">
                    <ul class="nav navbar-nav">
                        <li><a class="navbar-link" [routerLink]="['TasksPage']">Tasks</a></li>
                        <li><a class="navbar-link" [routerLink]="['ScrumPage']">Scrum</a></li>
                        <li><a class="navbar-link" [routerLink]="['ProjectsPage']">Projects</a></li>
                    </ul>
                    <ul class="nav navbar-nav navbar-right">
                        <li><span class="navbar-link" 
                                  (click)="logOut()"
                                  data-qa="logout-main-menu-button">Logout</span></li>
                    </ul>
                </div>
            </div>
        </nav>
    `,
})
export class MainMenu {
    constructor(
        private authorizationService: AuthorizationService
    ) {

    }

    logOut(): void {
        this.authorizationService.logout();
    }
}
