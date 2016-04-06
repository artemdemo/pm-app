import {Component, Inject} from 'angular2/core';
import {TasksService, ITaskService, ITask} from '../services/TasksService';
import {SelectedTaskService, ISelectedTaskService} from '../services/SelectedTaskService';
import OkCircle from './OkCircle';

@Component({
    selector: 'tasks-list',
    directives: [OkCircle],
    template: `
        <div class="tasks-list">
            <div class="tasks-list-item" *ngFor="#task of tasks">
                <div class="tasks-list-item__cell 
                            tasks-list-item__cell_icon">
                    <ok-circle></ok-circle>
                </div>
                <div class="tasks-list-item__cell" (click)="selectTask(task)">
                    {{ task.name }}
                </div>
                <div class="tasks-list-item__cell 
                            tasks-list-item__cell_icon 
                            tasks-list-item__cell_expend">
                    <span class="glyphicon glyphicon-expand" aria-hidden="true"></span>
                </div>
            </div>
        </div>
    `
})
export default class TasksList {
    private tasks: ITask[] = [];
    private tasksSubscription;

    constructor(@Inject(TasksService) private TasksService: ITaskService,
                @Inject(SelectedTaskService) private SelectedTaskService: ISelectedTaskService) {
        this.tasksSubscription = TasksService.tasks.subscribe(newTasks => {
            this.tasks = newTasks;
        });
    }

    selectTask(task: ITask) {
        console.log(task);
        this.SelectedTaskService.setSelectedTask(task);
    }

    ngOnDestroy() {
        this.tasksSubscription.unsubscribe();
    }
}
