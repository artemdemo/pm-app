import {Component} from '@angular/core';
import {CanActivate, ComponentInstruction} from '@angular/router-deprecated';
import {BoardsService} from '../services/BoardsService';
import {SelectedEntityService, EntityType} from '../services/SelectedEntityService';
import {BoardsList} from '../components/BoardsList/BoardsList';
import {SingleBoard} from '../components/BoardsList/SingleBoard';
import {isLoggedIn} from '../services/AuthorizationService';

@CanActivate((next: ComponentInstruction, previous: ComponentInstruction) => {
    return isLoggedIn(next, previous);
})
@Component({
    selector: 'scrum-page',
    directives: [BoardsList, SingleBoard],
    template: `
        <div class="list-container"
             [ngClass]="{'list-container_open-right-panel' : openSingleBoard}">
            <div class="list-container__list">
                <boards-list></boards-list>
            </div>
            <div class="list-container__panel">
                <single-board></single-board>
            </div>
        </div>
    `,
})
export class ScrumPage {
    private openSingleBoard: boolean = false;
    private boardSubscription: any;

    constructor(
        private boardsService: BoardsService,
        private selectedEntityService: SelectedEntityService
    ) {
        boardsService.loadBoards();
        this.boardSubscription = selectedEntityService.getEntitySubject(EntityType.board).subscribe(newBoard => {
            this.openSingleBoard = !!newBoard;
        });
    }

    ngOnDestroy(): void {
        this.boardSubscription.unsubscribe();
    }
}
