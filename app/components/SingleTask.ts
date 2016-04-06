import {Component, Inject} from 'angular2/core';
import {Task} from '../services/TasksService';
import {SelectedTaskService, ISelectedTaskService} from '../services/SelectedTaskService';

@Component({
    selector: 'single-task',
    template: `
        <div class="single-task">
            <form (ngSubmit)="submitTask()">
                <div class="form-group">
                    <input type="text"
                           class="flat-input"
                           placeholder="Task name"
                           [(ngModel)]="task.name">
                </div>
                <div class="form-group">
                    <textarea class="flat-input" rows="3"></textarea>
                </div>
                <div class="clearfix">
                    <div class="pull-left">
                        <button type="submit" class="btn btn-primary">Save</button>
                        <span class="btn btn-default">Cancel</span>
                    </div>
                    <div class="pull-right">
                        <span class="btn btn-link btn-link_danger">Delete</span>
                    </div>
                </div>
            </form>
        </div>
    `
})
export default class SingleTask {
    private task = new Task('', '', false);
    private taskSubscription;

    constructor(@Inject(SelectedTaskService) private SelectedTaskService: ISelectedTaskService) {
        this.taskSubscription = SelectedTaskService.task.subscribe(newTask => {
            console.log('SingleTask ->', newTask);
        });
    }

    submitTask() {}
}
