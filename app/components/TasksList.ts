import {Component, Inject} from 'angular2/core';
import {TasksService, ITasksService, ITask} from '../services/TasksService';
import {SelectedTaskService, ISelectedTaskService} from '../services/SelectedTaskService';
import {OkCircle} from './OkCircle';

@Component({
    selector: 'tasks-list',
    directives: [OkCircle],
    template: `
        <div class="tasks-list">
            <div class="tasks-list-item" *ngFor="#task of tasks">
                <div class="tasks-list-item__cell 
                            tasks-list-item__cell_icon">
                    <ok-circle [status]="task.done" (toggled)="toggleDone(task.id, $event)"></ok-circle>
                </div>
                <div class="tasks-list-item__cell" (click)="selectTask(task)">
                    <span class="tasks-list-item__text"
                          [ngClass]="{'tasks-list-item__text_done' : task.done}">
                        {{ task.name }}
                    </span>
                </div>
                <div class="tasks-list-item__cell 
                            tasks-list-item__cell_icon">
                    <span class="glyphicon glyphicon-triangle-right"
                          aria-hidden="true"
                          *ngIf="selectedTask && selectedTask.id == task.id"></span>
                </div>
            </div>
        </div>
        <button class="btn btn-default" (click)="addNewTask()">New Task</button>
    `
})
export default class TasksList {
    private tasks: ITask[] = [];
    private tasksSubscription;
    private selectedTask: ITask = null;
    private selectedTaskSubscription;

    constructor(@Inject(TasksService) private TasksService: ITasksService,
                @Inject(SelectedTaskService) private SelectedTaskService: ISelectedTaskService) {
        this.tasksSubscription = TasksService.tasks.subscribe(newTasks => {
            this.tasks = newTasks;
        });
        this.selectedTaskSubscription = SelectedTaskService.task.subscribe(newSelectedTask => {
            this.selectedTask = newSelectedTask;
        });
    }

    selectTask(task: ITask) {
        this.SelectedTaskService.setSelectedTask(task);
    }

    addNewTask() {
        this.SelectedTaskService.setNewTask();
    }

    toggleDone(taskId, done) {
        this.TasksService.toggleDone(taskId, done);
    }

    ngOnDestroy() {
        this.tasksSubscription.unsubscribe();
    }
}
