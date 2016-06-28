import {Component} from '@angular/core';
import {CanActivate, ComponentInstruction} from '@angular/router-deprecated';
import {BoardsService} from '../services/BoardsService';
import {BoardsList} from '../components/BoardsList/BoardsList';
import {isLoggedIn} from '../services/AuthorizationService';

@CanActivate((next: ComponentInstruction, previous: ComponentInstruction) => {
    return isLoggedIn(next, previous);
})
@Component({
    selector: 'scrum-page',
    directives: [BoardsList],
    template: `
        <div class="list-container">
            <div class="list-container__list">
                <boards-list></boards-list>
            </div>
        </div>
    `,
})
export class ScrumPage {

    constructor(
        private boardsService: BoardsService
    ) {
        boardsService.loadBoards();
    }

}
