/// <reference path="../typings/browser.d.ts" />

import 'zone.js/dist/zone';
import 'reflect-metadata';

import {bootstrap} from 'angular2/platform/browser';
import {provide} from 'angular2/core';
import {ProjectManagement} from './ProjectManagement';
import {HTTP_PROVIDERS} from 'angular2/http';
import {ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy} from 'angular2/router';
import {TasksService} from './services/TasksService';
import {SelectedTaskService} from './services/SelectedTaskService';
import {ProjectsService} from './services/ProjectsService';
import {SelectedProjectService} from './services/SelectedProjectService';

bootstrap(ProjectManagement, [
    HTTP_PROVIDERS,
    ROUTER_PROVIDERS,
    provide(LocationStrategy, {useClass: HashLocationStrategy}),
    TasksService,
    SelectedTaskService,
    ProjectsService,
    SelectedProjectService
]);
