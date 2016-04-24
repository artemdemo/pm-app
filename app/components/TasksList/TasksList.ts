import {Component, Inject} from 'angular2/core';
import {TasksService, ITasksService, ITask} from '../../services/TasksService';
import {SelectedTaskService, ISelectedTaskService} from '../../services/SelectedTaskService';
import {TasksListItem} from './TasksListItem';

@Component({
    selector: 'tasks-list',
    directives: [TasksListItem],
    template: `
        <div class="tasks-list">
            <tasks-list-item [task]="task" 
                             *ngFor="#task of tasks"></tasks-list-item>
        </div>
        <button class="btn btn-default" (click)="addNewTask()">New Task</button>
    `,
})
export class TasksList {
    private tasks: ITask[] = [];
    private tasksSubscription: any;

    constructor(@Inject(TasksService) private TasksService: ITasksService,
                @Inject(SelectedTaskService) private SelectedTaskService: ISelectedTaskService) {
        this.tasksSubscription = TasksService.tasks.subscribe(newTasks => {
            this.tasks = newTasks;
        });
    }

    ngOnInit(): void {
        this.TasksService.refreshTasks();
    }

    addNewTask(): void {
        this.SelectedTaskService.setNewTask();
    }

    ngOnDestroy(): void {
        this.tasksSubscription.unsubscribe();
    }
}
