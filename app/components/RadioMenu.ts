import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {IGeneralListItem} from '../interfaces/IGeneralListItem';

@Component({
    selector: 'radio-menu',
    directives: [],
    template: `
        <div class="radio-menu">
            <div class="radio-menu-item"
                 *ngFor="#item of list"
                 [ngClass]="{'radio-menu-item_selected': selectedItem && selectedItem.id == item.id}"
                 (click)="select(item)">
                {{ item.name }}
            </div>
        </div>
    `,
})
export class RadioMenu {
    @Input() list: IGeneralListItem[] = [];
    @Output() onSelect: EventEmitter<IGeneralListItem> = new EventEmitter<IGeneralListItem>();

    private selectedItem: IGeneralListItem;

    select(item: IGeneralListItem): void {
        this.selectedItem = item;
        this.onSelect.emit(item);
    }

    ngOnInit(): void {
        this.select(this.list[0]);
    }
}
