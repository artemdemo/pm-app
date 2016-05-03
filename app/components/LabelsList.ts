import {Component, Input, Output, EventEmitter} from '@angular/core';
import {IGeneralListItem} from '../interfaces/IGeneralListItem';


@Component({
    selector: 'labels-list',
    template: `
        <ul class="labels-list">
            <li class="labels-list-item label label-primary"
                [ngClass]="{'labels-list-item_delitable': delitable}"
                *ngFor="let item of list">
                {{ item.name }}
                <span class="labels-list-item__close"
                      (click)="deleteItem(item)"
                      *ngIf="delitable">
                    <span class="glyphicon glyphicon-remove"></span>
                </span>
            </li>
        </ul>
    `,
})
export class LabelsList {
    @Input() list: IGeneralListItem[];
    @Input() delitable: boolean = false;
    @Output() onDelete: EventEmitter<IGeneralListItem> = new EventEmitter<IGeneralListItem>();

    deleteItem(item: IGeneralListItem): void {
        this.onDelete.emit(item);
    }
}
