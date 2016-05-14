/// <reference path="../typings/browser.d.ts" />

import 'zone.js/dist/zone';
import 'reflect-metadata';

import {bootstrap} from '@angular/platform-browser-dynamic';
import {provide} from '@angular/core';
import {HTTP_PROVIDERS} from '@angular/http';
import {ROUTER_PROVIDERS} from '@angular/router-deprecated';
import {LocationStrategy, PathLocationStrategy} from '@angular/common';
import {MainRouter} from './MainRouter';
import {AuthorizationService} from './services/AuthorizationService';
import {TasksService} from './services/TasksService';
import {SelectedTaskService} from './services/SelectedTaskService';
import {ProjectsService} from './services/ProjectsService';
import {SelectedProjectService} from './services/SelectedProjectService';

bootstrap(MainRouter, [
    HTTP_PROVIDERS,
    ROUTER_PROVIDERS,
    provide(LocationStrategy, {useClass: PathLocationStrategy}),
    AuthorizationService,
    TasksService,
    SelectedTaskService,
    ProjectsService,
    SelectedProjectService
]);
