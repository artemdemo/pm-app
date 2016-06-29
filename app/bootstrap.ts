/// <reference path="../typings/tsd.d.ts" />

import 'zone.js/dist/zone';
import 'reflect-metadata';

import {bootstrap} from '@angular/platform-browser-dynamic';
import {ComponentRef} from '@angular/core';
import {HTTP_PROVIDERS} from '@angular/http';
import {ROUTER_PROVIDERS} from '@angular/router-deprecated';
import {LocationStrategy, PathLocationStrategy} from '@angular/common';
import {disableDeprecatedForms, provideForms} from '@angular/forms';
import {MainRouter} from './MainRouter';
import {AuthorizationService} from './services/AuthorizationService';
import {TasksService} from './services/TasksService';
import {SelectedEntityService} from './services/SelectedEntityService';
import {ProjectsService} from './services/ProjectsService';
import {BoardsService} from './services/BoardsService';
import {appInjector} from './services/appInjector';

bootstrap(MainRouter, [
    HTTP_PROVIDERS,
    ROUTER_PROVIDERS,
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    AuthorizationService,
    TasksService,
    SelectedEntityService,
    ProjectsService,
    BoardsService,
    disableDeprecatedForms(),
    provideForms()
]).then((appRef: ComponentRef<MainRouter>) => {
    appInjector(appRef.injector);
});
