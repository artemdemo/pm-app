import {Component, Input, Output, EventEmitter, SimpleChange} from '@angular/core';
import {IGeneralListItem} from '../interfaces/IGeneralListItem';

interface IListItemLabel {
    list?: SimpleChange;
    delitable?: SimpleChange;
    limit?: SimpleChange;
}

@Component({
    selector: 'labels-list',
    template: `
        <ul class="labels-list">
            <li class="labels-list-item label label-primary"
                [ngClass]="{'labels-list-item_delitable': delitable}"
                *ngFor="let item of filterLabelsList(list)">
                {{ item.name }}
                <span class="labels-list-item__close"
                      (click)="deleteItem(item)"
                      *ngIf="delitable">
                    <span class="glyphicon glyphicon-remove"></span>
                </span>
            </li>
            <li class="labels-list-item label label-primary"
                [ngClass]="{'labels-list-item_hide': hideItem()}">
                ...
            </li>
        </ul>
    `,
})
export class LabelsList {
    @Input() list: IGeneralListItem[];
    @Input() delitable: boolean = false;
    @Input() limit: number;
    @Output() onDelete: EventEmitter<IGeneralListItem> = new EventEmitter<IGeneralListItem>();

    deleteItem(item: IGeneralListItem): void {
        this.onDelete.emit(item);
    }

    hideItem(): boolean {
        return !this.limit || this.list.length <= this.limit;
    }

    filterLabelsList(newLabelsList: IGeneralListItem[]): IGeneralListItem[] {
        if (!this.limit) {
            return newLabelsList;
        } else {
            let list: IGeneralListItem[] = [];
            let limitCount: number = 0;
            for (let i: number = 0, len: number = newLabelsList.length; i < len; i++) {
                if (limitCount < this.limit) {
                    list.push(newLabelsList[i]);
                }
                limitCount++;
            }
            return list;
        }
    }
}
