import {Component, Input} from '@angular/core';
import {LoadingSpinner} from './LoadingSpinner';

@Component({
    selector: 'ok-circle',
    directives: [LoadingSpinner],
    template: `
        <span class="ok-circle-container">
            <span class="ok-circle"
                  [ngClass]="{'ok-circle_done': status}"
                  *ngIf="!loading">
                <span class="glyphicon glyphicon-ok-circle" aria-hidden="true"></span>
            </span>
            <loading-spinner color="green" *ngIf="loading"></loading-spinner>
            <span class="ok-circle-content" [ngClass]="{'ok-circle-content_done': status}">
                <ng-content></ng-content>
            </span>
        </span>
    `,
})
export class OkCircle {
    @Input() status: boolean = false;
    @Input() loading: boolean = false;
}
