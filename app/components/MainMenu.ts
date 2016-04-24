import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

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
                        <li><a [routerLink]="['/TasksPage']">Tasks</a></li>
                        <li><a [routerLink]="['/ProjectsPage']">Projects</a></li>
                    </ul>
                </div>
            </div>
        </nav>
    `,
})
export class MainMenu {
}
