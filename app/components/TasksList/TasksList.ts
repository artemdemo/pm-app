import {Component, Inject} from 'angular2/core';
import {TasksService, ITasksService, ITask} from '../../services/TasksService';
import {SelectedTaskService, ISelectedTaskService} from '../../services/SelectedTaskService';
import {TasksListItem} from './TasksListItem';
import {RadioMenu} from '../RadioMenu';
import {IGeneralListItem} from '../../interfaces/IGeneralListItem';
import {FilterTasks, filterTasksType} from '../../pipes/FilterTasks';

@Component({
    selector: 'tasks-list',
    directives: [TasksListItem, RadioMenu],
    pipes: [FilterTasks],
    template: `
        <radio-menu [list]="listMenu"
                    (onSelect)="filterTasks($event)"></radio-menu>
        <div class="tasks-list">
            <tasks-list-item [task]="task"
                             *ngFor="#task of tasks | filterTasks : filterType">
            </tasks-list-item>
        </div>
        <button class="btn btn-default" (click)="addNewTask()">New Task</button>
    `,
})
export class TasksList {
    private tasks: ITask[] = [];
    private tasksSubscription: any;
    private listMenu: IGeneralListItem[] = [];
    private filterType: filterTasksType;

    constructor(
        @Inject(TasksService) private TasksService: ITasksService,
        @Inject(SelectedTaskService) private SelectedTaskService: ISelectedTaskService
    ) {
        this.tasksSubscription = TasksService.tasks.subscribe(newTasks => {
            this.tasks = newTasks;
        });
        this.listMenu = [
            { id: filterTasksType.all, name: 'All'},
            { id: filterTasksType.active, name: 'Active' },
            { id: filterTasksType.completed, name: 'Completed' },
        ];
    }

    addNewTask(): void {
        this.SelectedTaskService.setNewTask();
    }

    filterTasks(filter: IGeneralListItem): void {
        this.filterType = filter.id;
    }

    ngOnInit(): void {
        this.TasksService.refreshTasks();
    }

    ngOnDestroy(): void {
        this.tasksSubscription.unsubscribe();
    }
}
