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
                *ngFor="let item of labelsList">
                {{ item.name }}
                <span class="labels-list-item__close"
                      (click)="deleteItem(item)"
                      *ngIf="delitable">
                    <span class="glyphicon glyphicon-remove"></span>
                </span>
            </li>
            <li class="labels-list-item label label-primary"
                *ngIf="list.length > limit">
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

    private labelsList: IGeneralListItem[] = [];

    deleteItem(item: IGeneralListItem): void {
        this.onDelete.emit(item);
    }

    updateLabelsList(newLabelsList?: IGeneralListItem[]): void {
        const list: IGeneralListItem[] = newLabelsList || this.list;
        if (!this.limit) {
            this.labelsList = list;
        } else {
            let limitCount: number = 0;
            this.labelsList = [];
            for (let i: number = 0, len: number = list.length; i < len; i++) {
                if (limitCount < this.limit) {
                    this.labelsList.push(list[i]);
                }
                limitCount++;
            }
        }
    }

    ngAfterContentChecked(): void {
        this.updateLabelsList();
    }

    ngOnChanges(changes: IListItemLabel): void {
        this.updateLabelsList(changes.list.currentValue);
    }
}
