import {Component, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'delete-btn',
    directives: [],
    template: `
        <span class="btn btn-link btn-link_danger"
              *ngIf="!showDelete"
              (click)="showDeleteButtons()"
              [ngClass]="{btn_disabled: loadingData}">Delete</span>
        <div class="delete-task" *ngIf="showDelete">
            <div class="delete-task__title">Delete?</div>
            <div class="delete-task-buttons">
                <span class="glyphicon
                             glyphicon-ok-sign
                             delete-task-buttons__ok"
                      aria-hidden="true"
                      (click)="delete()"></span>
                <span class="glyphicon
                             glyphicon-remove-sign
                             delete-task-buttons__cancel"
                      aria-hidden="true"
                      (click)="hideDeleteButtons()"></span>
            </div>
        </div>
    `,
})
export class DeleteBtn {
    @Output() onDelete: EventEmitter<any> = new EventEmitter<any>();
    private showDelete: boolean = false;

    showDeleteButtons(): void {
        this.showDelete = true;
    }

    hideDeleteButtons(): void {
        this.showDelete = false;
    }

    delete(): void {
        this.onDelete.emit(true);
    }
}
