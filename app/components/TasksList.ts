import {Component, Inject} from 'angular2/core';
import {TasksService, ITaskService, ITask} from '../services/TasksService';
import OkCircle from './OkCircle';

@Component({
    selector: 'tasks-list',
    directives: [OkCircle],
    template: `
        <div class="tasks-list">
            <div class="tasks-list-item" *ngFor="#task of tasks">
                <ok-circle></ok-circle>
                {{ task.name }}
            </div>
        </div>
    `
})
export default class TasksList {
    private tasks: ITask[] = [];
    private tasksSubscription;

    constructor(@Inject(TasksService) private TasksService: ITaskService) {
        this.tasksSubscription = TasksService.tasks.subscribe(newTasks => {
            console.log(newTasks);
            this.tasks = newTasks;
        });
    }

    ngOnDestroy() {
        this.tasksSubscription.unsubscribe();
    }
}
