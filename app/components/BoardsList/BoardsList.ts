import {Component} from '@angular/core';
import {Board} from './Board';
import {IBoard, BoardsService} from '../../services/BoardsService';

@Component({
    selector: 'boards-list',
    directives: [Board],
    template: `
        <div class="boards-list">
            <scrum-board [board]="board"
                         *ngFor="let board of boards"></scrum-board>
        </div>
        <button class="btn btn-default"
                (click)="addNewBoard()"
                data-qa="add-new-board">New Board</button>
    `,
})
export class BoardsList {
    private boards: IBoard[] = [];
    private boardsSubscription: any;

    constructor(
        private boardsService: BoardsService
    ) {
    }

    ngOnInit(): void {
        this.boardsSubscription = this.boardsService.boards.subscribe(newBoards => {
            this.boards = newBoards;
        });
        this.boardsService.refreshBoards();
    }

    ngOnDestroy(): void {
        this.boardsSubscription.unsubscribe();
    }

    addNewBoard(): void {
        console.log('Add new board');
    }
}
