import {Component, Inject} from 'angular2/core';
import TasksList from '../components/TasksList';
import SingleTask from '../components/SingleTask';
import {SelectedTaskService, ISelectedTaskService} from '../services/SelectedTaskService';

@Component({
    selector: 'tasks-page',
    directives: [TasksList, SingleTask],
    template: `
        <div class="tasks-edit" [ngClass]="{'tasks-edit_open-single-task' : openSingleTask}">
            <div class="tasks-edit__tasks-list">
                <tasks-list></tasks-list>
            </div>
            <div class="tasks-edit__single-task">
                <single-task></single-task>
            </div>
        </div>
    `
})
export default class TasksPage {
    private openSingleTask = false;
    private taskSubscription;

    constructor(@Inject(SelectedTaskService) private SelectedTaskService: ISelectedTaskService) {
        this.taskSubscription = SelectedTaskService.task.subscribe(newTask => {
            this.openSingleTask = !!(newTask.hasOwnProperty('id') && Number(newTask.id) > 0);
        });
    }

    ngOnDestroy() {
        this.taskSubscription.unsubscribe();
    }
}
