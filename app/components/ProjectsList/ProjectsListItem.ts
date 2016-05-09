import {Component, Input, Injectable} from '@angular/core';
import {ProjectsService, IProject} from '../../services/ProjectsService';
import {SelectedProjectService} from '../../services/SelectedProjectService';
import {TasksService, ITask} from '../../services/TasksService';
import {IGeneralListItem} from '../../interfaces/IGeneralListItem';

@Component({
    selector: 'projects-list-item',
    directives: [],
    template: `
        <div class="projects-list-item"
             [ngClass]="{'projects-list-item_selected': selectedProject && selectedProject.id == project.id}"
             (click)="selectTask()">
            <div class="projects-list-item__title">
                {{ project.name }}
            </div>
            <div class="text-muted">
                Tasks: {{ activeTasks().length }}
            </div>
            <div class="text-muted">
                Done: {{ completedTasks().length }}
            </div>
        </div>
    `,
})
@Injectable()
export class ProjectsListItem {
    @Input() project: IProject;
    private tasksList: IGeneralListItem[] = [];
    private selectedProject: IProject = null;
    private selectedProjectSubscription: any;
    private tasksSubscription: any;

    constructor(
        private ProjectsService: ProjectsService,
        private TasksService: TasksService,
        private SelectedProjectService: SelectedProjectService
    ) {
        this.selectedProjectSubscription = SelectedProjectService.project.subscribe(newSelectedProject => {
            this.selectedProject = newSelectedProject;
        });
        this.tasksSubscription = TasksService.tasks.subscribe(newTasks => {
            this.tasksList = newTasks.map((task: ITask) => {
                return {
                    id: task.id,
                    name: task.name,
                    done: task.done,
                };
            });
        });
        TasksService.refreshTasks();
    }

    completedTasks(): IGeneralListItem[] {
        return this.tasksList.filter((task: IGeneralListItem) => {
            return task.done;
        });
    }

    activeTasks(): IGeneralListItem[] {
        return this.tasksList.filter((task: IGeneralListItem) => {
            return !task.done;
        });
    }

    selectTask(): void {
        this.SelectedProjectService.setSelectedProject(this.project.id);
    }

    ngOnDestroy(): void {
        this.selectedProjectSubscription.unsubscribe();
    }
}
