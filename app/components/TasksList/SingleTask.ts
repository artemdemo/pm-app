import {Component} from '@angular/core';
import {REACTIVE_FORM_DIRECTIVES} from '@angular/forms';
import {Task, ITask} from '../../services/TasksService';
import {SelectedEntityService, EntityType} from '../../services/SelectedEntityService';
import {TasksService} from '../../services/TasksService';
import {ProjectsService, IProject} from '../../services/ProjectsService';
import {BoardsService, IBoard} from '../../services/BoardsService';
import {LoadingSpinner} from '../LoadingSpinner';
import {OkCircle} from '../OkCircle';
import {DeleteBtn} from '../DeleteBtn';
import {DropdownList} from '../DropdownList';
import {LabelsList} from '../LabelsList';
import {IGeneralListItem} from '../../interfaces/IGeneralListItem';

@Component({
    selector: 'single-task',
    directives: [REACTIVE_FORM_DIRECTIVES, LoadingSpinner, OkCircle, DeleteBtn, DropdownList, LabelsList],
    template: `
        <div class="single-panel">
            <form (ngSubmit)="submitTask()" *ngIf="taskModel">
                <div class="form-group">
                    <input type="text"
                           name="name"
                           class="flat-input"
                           placeholder="Task name"
                           [(ngModel)]="taskModel.name"
                           data-qa="task-name">
                </div>
                <div class="form-group">
                    <textarea class="flat-input"
                              name="description"
                              rows="3"
                              [(ngModel)]="taskModel.description"
                              data-qa="task-description"></textarea>
                </div>
                <div class="form-group">
                    <ok-circle [status]="taskModel.done" (click)="toggleDone()">Mark done</ok-circle>
                </div>
                <div class="form-group">
                    <labels-list [list]="selectedProjects"
                                 [delitable]="true"
                                 (onDelete)="disconnectProject($event)">
                    </labels-list>
                </div>
                <div class="form-group">
                    <dropdown-list [list]="availableProjects"
                                   placeholder="Connect to project"
                                   (onSelect)="connectProject($event)"></dropdown-list>
                </div>
                <div class="form-group">
                    <select class="form-control"
                            name="board"
                            [(ngModel)]="taskModel.board_id">
                        <option [value]="board.id" *ngFor="let board of boardsList">{{ board.name }}</option>
                    </select>
                </div>
                <div class="form-group text-muted" *ngIf="task.added">
                    <p>Task Added: {{ task.added }}</p>
                    <p>Last updated: {{ task.updated }}</p>
                </div>
                <div class="clearfix">
                    <div class="pull-left">
                        <button type="submit"
                                class="btn btn-primary"
                                [disabled]="loadingData"
                                data-qa="task-save">
                            <span *ngIf="!task.id">Add new</span>
                            <span *ngIf="task.id">Save</span>
                        </button>
                        <span class="btn btn-default"
                              (click)="cancel()"
                              [ngClass]="{btn_disabled: loadingData}"
                              data-qa="task-cancel">Cancel</span>
                        <span class="btn btn-link" *ngIf="loadingData">
                            <loading-spinner></loading-spinner>
                        </span>
                    </div>
                    <div class="pull-right" *ngIf="task.id">
                        <delete-btn (onDelete)="deleteTask()" data-qa="task-delete"></delete-btn>
                    </div>
                </div>
            </form>
        </div>
    `,
})
export class SingleTask {
    private loadingData: boolean = false;

    private task: ITask;
    private taskModel: Task;
    private taskSubscription: any;

    private projectsSubscription: any;
    private projectsList: IGeneralListItem[] = [];
    private availableProjects: IGeneralListItem[] = [];
    private selectedProjects: IProject[] = [];

    private boardsList: IGeneralListItem[] = [];
    private boardsSubscription: any;
    private selectedBoard: IGeneralListItem;

    constructor(
        private selectedEntityService: SelectedEntityService,
        private tasksService: TasksService,
        private projectsService: ProjectsService,
        private boardsService: BoardsService
    ) {
        this.taskSubscription = selectedEntityService.getEntitySubject(EntityType.task).subscribe(selectedTask => {
            if (selectedTask) {
                this.task = selectedTask;
                this.taskModel = new Task(selectedTask);
                this.selectedProjects = [];
                this.availableProjects = [];
                this.projectsList.forEach((project: IProject) => {
                    if (this.task.projects.indexOf(project.id) > -1) {
                        this.selectedProjects.push(project);
                    } else {
                        this.availableProjects.push(project);
                    }
                });
                if (selectedTask.board_id) {
                    this.selectedBoard = selectedTask.board_id;
                }
            } else {
                this.taskModel = null;
                this.task = null;
            }
        });
        this.projectsSubscription = projectsService.projects.subscribe(newProjects => {
            this.projectsList = newProjects.map((project: IProject) => {
                return {
                    id: project.id,
                    name: project.name,
                };
            });
        });
        projectsService.refreshProjects();
        this.boardsSubscription = boardsService.boards.subscribe(newBoards => {
            this.boardsList = newBoards.map((board: IBoard) => {
                return {
                    id: board.id,
                    name: board.title,
                };
            });
        });
        boardsService.refreshBoards();
    }

    connectProject(project: IGeneralListItem): void {
        this.loadingData = true;
        this.tasksService.connectProject(this.task.id, project.id)
            .then(() => {
                this.loadingData = false;
                this.selectedEntityService.setSelectedEntity(this.task.id, EntityType.task);
            }, () => {
                this.loadingData = false;
            });
    }

    disconnectProject(project: IGeneralListItem): void {
        this.loadingData = true;
        this.tasksService.disconnectProject(this.task.id, project.id)
            .then(() => {
                this.loadingData = false;
                this.selectedEntityService.setSelectedEntity(this.task.id, EntityType.task);
            }, () => {
                this.loadingData = false;
            });
    }

    connectBoard(board: IGeneralListItem): void {
        console.log(this.selectedBoard);
    }

    submitTask(): void {
        if (this.taskModel.name && !this.loadingData) {
            this.loadingData = true;
            if (this.task.id) {
                this.tasksService.updateTask(Object.assign(this.task, this.taskModel))
                    .then(() => {
                        this.selectedEntityService.dropSelectedEntity(EntityType.task);
                        this.loadingData = false;
                    }, () => this.loadingData = false);
            } else {
                this.tasksService.addTask(Object.assign(this.task, this.taskModel))
                    .then(() => {
                        this.selectedEntityService.dropSelectedEntity(EntityType.task);
                        this.loadingData = false;
                    }, () => this.loadingData = false);
            }
        }
    }

    deleteTask(): void {
        if (!this.loadingData) {
            this.loadingData = true;
            this.tasksService.deleteTask(this.task.id)
                .then(() => {
                    this.selectedEntityService.dropSelectedEntity(EntityType.task);
                    this.loadingData = false;
                }, () => this.loadingData = false);
        }
    }

    toggleDone(): void {
        this.taskModel.done = !this.taskModel.done;
    }

    cancel(): void {
        this.selectedEntityService.dropSelectedEntity(EntityType.task);
    }

    ngOnDestroy(): void {
        this.taskSubscription.unsubscribe();
        this.projectsSubscription.unsubscribe();
        this.selectedEntityService.dropSelectedEntity(EntityType.task);
    }
}
