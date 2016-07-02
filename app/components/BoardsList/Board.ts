import {Component, Input} from '@angular/core';
import {IBoard} from '../../services/BoardsService';
import {SelectedEntityService, EntityType} from '../../services/SelectedEntityService';
import {TasksService, ITask} from '../../services/TasksService';
import {IGeneralListItem} from '../../interfaces/IGeneralListItem';

@Component({
    selector: 'scrum-board',
    directives: [],
    template: `
        <div class="board__title">
            <div class="board__name">{{ board.title }}</div>
            <div class="board__edit-board"
                 (click)="selectBoard()">
                <span class="glyphicon glyphicon-pencil"></span>
            </div>
        </div>
        <div class="board-tasks">
            <div class="board-tasks__item"
                 *ngFor="let task of filterTasks()">
                {{ task.name }}
            </div>
        </div>
    `,
})
export class Board {
    @Input() board: IBoard;

    private selectedBoardSubscription: any;
    private selectedBoard: IBoard = null;

    private tasksList: IGeneralListItem[] = [];
    private tasksSubscription: any;

    constructor(
        private TasksService: TasksService,
        private SelectedEntityService: SelectedEntityService
    ) {
        this.selectedBoardSubscription = SelectedEntityService.getEntitySubject(EntityType.board).subscribe(newSelectedBoard => {
            this.selectedBoard = newSelectedBoard;
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

    selectBoard(): void {
        this.SelectedEntityService.setSelectedEntity(this.board.id, EntityType.board);
    }

    filterTasks(): IGeneralListItem[] {
        return this.tasksList.filter(task => this.board.tasks.indexOf(task.id) > -1);
    };

    ngOnDestroy(): void {
        this.selectedBoardSubscription.unsubscribe();
    }
}
