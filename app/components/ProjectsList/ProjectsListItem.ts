import {Component, Input, ViewChild, ElementRef} from '@angular/core';
import {IProject} from '../../services/ProjectsService';
import {SelectedEntityService, EntityType} from '../../services/SelectedEntityService';
import {TasksService, ITask} from '../../services/TasksService';
import {IGeneralListItem} from '../../interfaces/IGeneralListItem';

// tslint:disable-next-line
const Chart = require('chart.js');

@Component({
    selector: 'projects-list-item',
    directives: [],
    template: `
        <div class="projects-list-item"
             [ngClass]="{'projects-list-item_selected': selectedProject && selectedProject.id == project.id}"
             (click)="selectTask()">
            <div class="projects-list-item__title"
                 [ngClass]="{'projects-list-item__title_has-items': project.tasks.length > 0}">
                {{ project.name }}
            </div>
            <div *ngIf="project.tasks.length > 0">
                <canvas #chartСanvas class="projects-list-item__donut-tasks" height="100"></canvas>
                <div class="text-muted">
                    Tasks: {{ filterTasks('all').length }}
                </div>
                <div class="text-muted">
                    Done: {{ filterTasks('done').length }}
                </div>
            </div>
        </div>
    `,
})
export class ProjectsListItem {
    @Input() project: IProject;
    @ViewChild('chartСanvas') canvas: ElementRef;

    private selectedProject: IProject = null;
    private selectedProjectSubscription: any;
    private tasksList: IGeneralListItem[] = [];
    private tasksSubscription: any;
    private chart: any = null;

    constructor(
        private TasksService: TasksService,
        private SelectedEntityService: SelectedEntityService
    ) {
        this.selectedProjectSubscription = SelectedEntityService.getEntitySubject(EntityType.project).subscribe(newSelectedProject => {
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

    ngAfterViewInit(): void {
        const allNumber: number = this.filterTasks('all').length;
        const doneNumber: number = this.filterTasks('done').length;
        if (allNumber > 0 && !this.chart) {
            let data: any = {
                labels: [],
                datasets: [
                    {
                        data: [allNumber, doneNumber],
                        borderWidth: 0,
                        backgroundColor: [
                            '#FF6384',
                            '#36A2EB',
                            '#FFCE56',
                        ],
                    },
                ],
            };
            let options: any = {
                tooltips: {
                    enabled: false,
                },
                maintainAspectRatio: false,
                cutoutPercentage: 70,
            };
            this.chart = new Chart(this.canvas.nativeElement, {
                type: 'doughnut',
                data,
                options,
            });
        }
    }

    filterTasks(filter: string): IGeneralListItem[] {
        if (this.project.tasks.length === 0) {
            return [];
        }
        /* tslint:disable */
        switch (filter) {
            case 'done':
                return this.tasksList.filter((task: IGeneralListItem) => {
                    return task.done === true && this.project.tasks.indexOf(task.id) !== -1;
                });
            case 'all':
            default:
                return this.tasksList.filter((task: IGeneralListItem) => {
                    return this.project.tasks.indexOf(task.id) !== -1;
                });
        }
        /* tslint:enable */
    }

    selectTask(): void {
        this.SelectedEntityService.setSelectedEntity(this.project.id, EntityType.project);
    }

    ngOnDestroy(): void {
        this.selectedProjectSubscription.unsubscribe();
    }
}
