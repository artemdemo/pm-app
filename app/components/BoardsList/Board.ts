import {Component, Input} from '@angular/core';
import {IBoard} from '../../services/BoardsService';
import {SelectedEntityService, EntityType} from '../../services/SelectedEntityService';

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
            <div class="board-tasks__item"></div>
        </div>
    `,
})
export class Board {
    @Input() board: IBoard;

    private selectedBoardSubscription: any;
    private selectedBoard: IBoard = null;

    constructor(
        private SelectedEntityService: SelectedEntityService
    ) {
        this.selectedBoardSubscription = SelectedEntityService.getEntitySubject(EntityType.board).subscribe(newSelectedBoard => {
            this.selectedBoard = newSelectedBoard;
        });
    }

    selectBoard(): void {
        this.SelectedEntityService.setSelectedEntity(this.board.id, EntityType.board);
    }

    ngOnDestroy(): void {
        this.selectedBoardSubscription.unsubscribe();
    }
}
