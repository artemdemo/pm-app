import {Component, Output, EventEmitter, Input} from 'angular2/core';

@Component({
    selector: 'ok-circle',
    directives: [],
    template: `
        <span class="ok-circle-container" (click)="toggleStatus()">
            <span class="ok-circle" [ngClass]="{'ok-circle_done': status}">
                <span class="glyphicon glyphicon-ok-circle" aria-hidden="true"></span>
            </span>
            <span class="ok-circle-content" [ngClass]="{'ok-circle-content_done': status}">
                <ng-content></ng-content> 
            </span>
        </span>
    `
})
export class OkCircle {
    @Input() status: boolean;
    @Output() toggled: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor() {}

    ngOnInit() {}

    toggleStatus() {
        this.status = !this.status;
        this.toggled.emit(this.status);
    }
}
