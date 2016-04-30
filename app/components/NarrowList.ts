import {Component, Input, Output, EventEmitter} from 'angular2/core';

export interface INarrowListItem {
    id: number;
    name: string;
}

@Component({
    selector: 'narrow-list',
    template: `
        <ul class="narrow-list">
            <li class="narrow-list-item"
                [ngClass]="{'narrow-list-item_delitable': delitable}"
                *ngFor="#item of list">
                <span class="narrow-list-item__name">
                    {{ item.name }}
                </span>
                <span class="narrow-list-item__close"
                      (click)="deleteItem(item)" 
                      *ngIf="delitable">
                    <span class="glyphicon glyphicon-remove"></span>
                </span>
            </li>
        </ul>
    `,
})
export class NarrowList {
    @Input() list: INarrowListItem[];
    @Input() delitable: boolean = false;
    @Output() onDelete: EventEmitter<INarrowListItem> = new EventEmitter<INarrowListItem>();

    deleteItem(item: INarrowListItem): void {
        this.onDelete.emit(item);
    }
}
