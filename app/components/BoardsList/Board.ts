import {Component, Input} from '@angular/core';
import {IBoard} from '../../services/BoardsService';

@Component({
    selector: 'scrum-board',
    directives: [],
    template: `
        <div class="board__title">
            <div class="board__name">{{ board.title }}</div>
            <div class="board__edit-board">
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

}
