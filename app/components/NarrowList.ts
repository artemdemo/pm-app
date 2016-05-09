import {Component, Input, Output, EventEmitter} from '@angular/core';
import {IGeneralListItem} from '../interfaces/IGeneralListItem';

@Component({
    selector: 'narrow-list',
    template: `
        <ul class="narrow-list">
            <li class="narrow-list-item"
                [ngClass]="{'narrow-list-item_delitable': delitable,
                            'narrow-list-item_done': item.done}"
                *ngFor="let item of list">
                <div class="narrow-list-item__cell narrow-list-item__cell_name">
                    <span class="narrow-list-item__name">
                        {{ item.name }}
                    </span>
                </div>
                <div class="narrow-list-item__cell narrow-list-item__cell_close">
                    <span class="narrow-list-item__close"
                          (click)="deleteItem(item)"
                          *ngIf="delitable">
                        <span class="glyphicon glyphicon-remove"></span>
                    </span>
                </div>
            </li>
        </ul>
    `,
})
export class NarrowList {
    @Input() list: IGeneralListItem[];
    @Input() delitable: boolean = false;
    @Output() onDelete: EventEmitter<IGeneralListItem> = new EventEmitter<IGeneralListItem>();

    deleteItem(item: IGeneralListItem): void {
        this.onDelete.emit(item);
    }
}
