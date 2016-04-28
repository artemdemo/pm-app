import {Component, Input} from 'angular2/core';

export interface ILabelsListItem {
    id: number;
    name: string;
}

@Component({
    selector: 'labels-list',
    template: `
        <ul class="labels-list">
            <li class="labels-list-item label label-primary"
                [ngClass]="{'labels-list-item_delitable': delitable}"
                *ngFor="#item of list">
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
    @Input() list: ILabelsListItem[];
    @Input() delitable: boolean = false;

    deleteItem(item: ILabelsListItem): void {
        console.log('deleteItem', item);
    }
}
