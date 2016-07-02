import {Component} from '@angular/core';
import {REACTIVE_FORM_DIRECTIVES} from '@angular/forms';
import {TasksService, ITask} from '../../services/TasksService';
import {BoardsService, Board, IBoard} from '../../services/BoardsService';
import {SelectedEntityService, EntityType} from '../../services/SelectedEntityService';
import {DeleteBtn} from '../DeleteBtn';
import {LoadingSpinner} from '../LoadingSpinner';
// import {DropdownList} from '../DropdownList';
import {NarrowList} from '../NarrowList';
import {IGeneralListItem} from '../../interfaces/IGeneralListItem';

@Component({
    selector: 'single-board',
    directives: [REACTIVE_FORM_DIRECTIVES, DeleteBtn, LoadingSpinner, NarrowList],
    template: `
        <div class="single-board">
            <form (ngSubmit)="submitBoard()" *ngIf="boardModel">
                <div class="form-group">
                    <input type="text"
                           name="title"
                           class="flat-input"
                           placeholder="Board title"
                           [(ngModel)]="boardModel.title">
                </div>
                <div class="form-group">
                    <textarea class="flat-input"
                              name="description"
                              rows="3"
                              [(ngModel)]="boardModel.description"></textarea>
                </div>
                <div class="form-group">
                    <div class="single-panel__subtitle" *ngIf="selectedTasks.length > 0">
                        Tasks
                    </div>
                    <narrow-list [list]="selectedTasks"
                                 [delitable]="true"
                                 (onDelete)="disconnectTask($event)">
                    </narrow-list>
                </div>
                <div class="form-group">
                    <dropdown-list [list]="availableTasks"
                                   placeholder="Add task to the board"
                                   (onSelect)="connectTask($event)"></dropdown-list>
                </div>
                <div class="form-group text-muted" *ngIf="board.added">
                    <p>Board Added: {{ board.added }}</p>
                    <p>Last updated: {{ board.updated }}</p>
                </div>
                <div class="clearfix">
                    <div class="pull-left">
                        <button type="submit" class="btn btn-primary" [disabled]="loadingData">
                            <span *ngIf="!board.id">Add new</span>
                            <span *ngIf="board.id">Save</span>
                        </button>
                        <span class="btn btn-default"
                              (click)="cancel()"
                              [ngClass]="{btn_disabled: loadingData}">Cancel</span>
                        <span class="btn btn-link" *ngIf="loadingData">
                            <loading-spinner></loading-spinner>
                        </span>
                    </div>
                    <div class="pull-right" *ngIf="board.id">
                        <delete-btn (onDelete)="deleteBoard()"></delete-btn>
                    </div>
                </div>
            </form>
        </div>
    `,
})
export class SingleBoard {
    private board: IBoard;
    private boardModel: Board;
    private boardSubscription: any;
    private loadingData: boolean = false;
    private tasksList: IGeneralListItem[] = [];
    private availableTasks: IGeneralListItem[] = [];
    private selectedTasks: ITask[] = [];
    private tasksSubscription: any;

    constructor(
        private selectedEntityService: SelectedEntityService,
        private tasksService: TasksService,
        private boardsService: BoardsService
    ) {
        this.boardSubscription = selectedEntityService.getEntitySubject(EntityType.board).subscribe(selectedBoard => {
            if (selectedBoard) {
                this.board = selectedBoard;
                this.boardModel = new Board(selectedBoard);
                this.availableTasks = [];
                this.selectedTasks = [];
                this.tasksList.forEach((task: ITask) => {
                    if (this.board.tasks.indexOf(task.id) > -1) {
                        this.selectedTasks.push(task);
                    } else {
                        this.availableTasks.push(task);
                    }
                });
            } else {
                this.boardModel = null;
                this.board = null;
            }
        });
        this.tasksSubscription = tasksService.tasks.subscribe(newTasks => {
            this.tasksList = newTasks.map((task: ITask) => {
                return {
                    id: task.id,
                    name: task.name,
                    done: task.done,
                };
            });
        });
        tasksService.refreshTasks();
        boardsService.refreshBoards();
    }

    connectTask(task: IGeneralListItem): void {
        this.loadingData = true;
        // this.boardsService.connectTask(task.id, this.board.id)
        //     .then(() => {
        //         this.loadingData = false;
        //         this.selectedEntityService.setSelectedEntity(this.board.id, EntityType.board);
        //     }, () => {
        //         this.loadingData = false;
        //     });
    }

    disconnectTask(task: IGeneralListItem): void {
        this.loadingData = true;
        // this.boardsService.disconnectTask(task.id, this.board.id)
        //     .then(() => {
        //         this.loadingData = false;
        //         this.selectedEntityService.setSelectedEntity(this.board.id, EntityType.board);
        //     }, () => {
        //         this.loadingData = false;
        //     });
    }

    submitBoard(): void {
        if (this.boardModel.title && !this.loadingData) {
            this.loadingData = true;
            if (this.board.id) {
                this.boardsService.updateBoard(Object.assign(this.board, this.boardModel))
                    .then(() => {
                        this.selectedEntityService.dropSelectedEntity(EntityType.board);
                        this.loadingData = false;
                    }, () => this.loadingData = false);
            } else {
                this.boardsService.addBoard(Object.assign(this.board, this.boardModel))
                    .then(() => {
                        this.selectedEntityService.dropSelectedEntity(EntityType.board);
                        this.loadingData = false;
                    }, () => this.loadingData = false);
            }
        }
    }

    deleteBoard(): void {
        if (!this.loadingData) {
            this.loadingData = true;
            this.boardsService.deleteBoard(this.board.id)
                .then(() => {
                    this.selectedEntityService.dropSelectedEntity(EntityType.board);
                    this.loadingData = false;
                }, () => this.loadingData = false);
        }
    }

    cancel(): void {
        this.selectedEntityService.dropSelectedEntity(EntityType.board);
    }

    ngOnDestroy(): void {
        this.tasksSubscription.unsubscribe();
        this.boardSubscription.unsubscribe();
        this.selectedEntityService.dropSelectedEntity(EntityType.board);
    }
}
