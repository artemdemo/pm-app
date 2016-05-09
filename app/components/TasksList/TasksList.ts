import {Component, Injectable} from '@angular/core';
import {TasksService, ITask} from '../../services/TasksService';
import {SelectedTaskService} from '../../services/SelectedTaskService';
import {TasksListItem} from './TasksListItem';
import {RadioMenu} from '../RadioMenu';
import {IGeneralListItem} from '../../interfaces/IGeneralListItem';

enum filterTasksType {
    all,
    active,
    completed
}

@Component({
    selector: 'tasks-list',
    directives: [TasksListItem, RadioMenu],
    template: `
        <radio-menu [list]="listMenu"
                    (onSelect)="setTasksFilter($event)"></radio-menu>
        <div class="tasks-list">
            <tasks-list-item [task]="task"
                             *ngFor="let task of filterByType(tasks, filterType)">
            </tasks-list-item>
        </div>
        <button class="btn btn-default" (click)="addNewTask()">New Task</button>
    `,
})
@Injectable()
export class TasksList {
    private tasks: ITask[] = [];
    private tasksSubscription: any;
    private listMenu: IGeneralListItem[] = [];
    private filterType: filterTasksType;

    constructor(
        private TasksService: TasksService,
        private SelectedTaskService: SelectedTaskService
    ) {
        this.listMenu = [
            { id: filterTasksType.all, name: 'All'},
            { id: filterTasksType.active, name: 'Active' },
            { id: filterTasksType.completed, name: 'Completed' },
        ];
    }

    addNewTask(): void {
        this.SelectedTaskService.setNewTask();
    }

    setTasksFilter(filter: IGeneralListItem): void {
        this.filterType = filter.id;
    }

    filterByType(tasks: ITask[], taskType: filterTasksType): ITask[] {
        return tasks.filter((item) => {
            switch (taskType) {
                case filterTasksType.active:
                    return item.done === false;
                case filterTasksType.completed:
                    return item.done === true;
                default:
                case filterTasksType.all:
                    return true;
            }
        });
    }

    ngOnInit(): void {
        this.tasksSubscription = this.TasksService.tasks.subscribe(newTasks => {
            this.tasks = newTasks;
        });
        this.TasksService.refreshTasks();
    }

    ngOnDestroy(): void {
        this.tasksSubscription.unsubscribe();
    }
}
