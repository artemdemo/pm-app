import {Component} from '@angular/core';
import {CanActivate, ComponentInstruction} from '@angular/router-deprecated';
import {TasksService} from '../services/TasksService';
import {TasksList} from '../components/TasksList/TasksList';
import {SingleTask} from '../components/TasksList/SingleTask';
import {SelectedEntityService, EntityType} from '../services/SelectedEntityService';
import {isLoggedIn} from '../services/AuthorizationService';

@CanActivate((next: ComponentInstruction, previous: ComponentInstruction) => {
    return isLoggedIn(next, previous);
})
@Component({
    selector: 'tasks-page',
    directives: [TasksList, SingleTask],
    template: `
        <div class="list-container"
             [ngClass]="{'list-container_open-right-panel' : openSingleTask}">
            <div class="list-container__list">
                <tasks-list></tasks-list>
            </div>
            <div class="list-container__panel">
                <single-task></single-task>
            </div>
        </div>
    `,
})
export class TasksPage {
    private openSingleTask: boolean = false;
    private taskSubscription: any;

    constructor(
        private selectedEntityService: SelectedEntityService,
        private tasksService: TasksService
    ) {
        this.tasksService.loadTasks();
        this.taskSubscription = selectedEntityService.getEntitySubject(EntityType.task).subscribe(newTask => {
            this.openSingleTask = !!newTask;
        });
    }

    ngOnDestroy(): void {
        this.taskSubscription.unsubscribe();
    }
}
