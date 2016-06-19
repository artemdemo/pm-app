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
import {SelectedTaskService} from './services/SelectedTaskService';
import {ProjectsService} from './services/ProjectsService';
import {SelectedProjectService} from './services/SelectedProjectService';
import {appInjector} from './services/appInjector';

bootstrap(MainRouter, [
    HTTP_PROVIDERS,
    ROUTER_PROVIDERS,
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    AuthorizationService,
    TasksService,
    SelectedTaskService,
    ProjectsService,
    SelectedProjectService,
    disableDeprecatedForms(),
    provideForms()
]).then((appRef: ComponentRef<MainRouter>) => {
    appInjector(appRef.injector);
});
