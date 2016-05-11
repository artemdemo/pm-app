import {Component, Input, Injectable} from '@angular/core';
import {TasksService, ITask} from '../../services/TasksService';
import {SelectedTaskService} from '../../services/SelectedTaskService';
import {ProjectsService, IProject} from '../../services/ProjectsService';
import {OkCircle} from '../OkCircle';
import {LabelsList} from '../LabelsList';

@Component({
    selector: 'tasks-list-item',
    directives: [OkCircle, LabelsList],
    template: `
        <div class="tasks-list-item">
            <div class="tasks-list-item__cell
                        tasks-list-item__cell_icon"
                        (click)="toggleDone()">
                <ok-circle [status]="task.done" [loading]="isLoading"></ok-circle>
            </div>
            <div class="tasks-list-item__cell" (click)="selectTask()">
                <span class="tasks-list-item__text"
                      [ngClass]="{'tasks-list-item__text_done' : task.done}">
                    {{ task.name }}
                </span>
            </div>
            <div class="tasks-list-item__cell
                        tasks-list-item__cell_labels">
                <labels-list class="labels-list_short-content"
                             [list]="selectedProjects"
                             [limit]="1"></labels-list>
            </div>
            <div class="tasks-list-item__cell
                        tasks-list-item__cell_icon">
                <span class="glyphicon glyphicon-triangle-right"
                      aria-hidden="true"
                      *ngIf="selectedTask && selectedTask.id == task.id"></span>
            </div>
        </div>
    `,
})
@Injectable()
export class TasksListItem {
    @Input() task: ITask;
    private selectedTask: ITask = null;
    private isLoading: Boolean = false;
    private selectedTaskSubscription: any;
    private projectsSubscription: any;
    private selectedProjects: IProject[] = [];
    private selectedProjectsId: Number[] = [];

    constructor(
        private TasksService: TasksService,
        private SelectedTaskService: SelectedTaskService,
        private ProjectsService: ProjectsService
    ) {
        this.selectedTaskSubscription = SelectedTaskService.task.subscribe(newSelectedTask => {
            this.selectedTask = newSelectedTask;
        });
        SelectedTaskService.refreshTask();
    }

    toggleDone(taskId: number, done: boolean): void {
        this.isLoading = true;
        this.TasksService.setDone(this.task.id, !this.task.done)
            .then(() => {
                this.isLoading = false;
                this.selectTask();
            });
    }

    selectTask(): void {
        this.SelectedTaskService.setSelectedTask(this.task.id);
    }

    ngOnInit(): void {
        this.projectsSubscription = this.ProjectsService.projects.subscribe(newProjects => {
            newProjects.forEach((project: IProject) => {
                if (this.task && this.task.projects.indexOf(project.id) > -1 && this.selectedProjectsId.indexOf(project.id) === -1) {
                    this.selectedProjects.push(project);
                    this.selectedProjectsId.push(project.id);
                }
            });
        });
        this.ProjectsService.refreshProjects();
    }

    ngOnDestroy(): void {
        this.selectedTaskSubscription.unsubscribe();
    }
}
