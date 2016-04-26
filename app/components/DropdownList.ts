import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {SearchName} from '../pipes/SearchName';

export interface IDropdownListItem {
    id: number;
    name: string;
}

@Component({
    selector: 'dropdown-list',
    directives: [],
    pipes: [SearchName],
    template: `
        <div class="dropdown-list">
            <input class="flat-input dropdown-list__input"
                   (focus)="inputFocus()"
                   (blur)="InputBlur()"
                   (ngModel)="searchInput"
                   [placeholder]="placeholder">
            <div class="dropdown-list-items"
                 [ngClass]="{'dropdown-list-items_show': dropdownIsVisible}"
                 *ngIf="list.length > 0">
                <div class="dropdown-list-items__child" 
                     *ngFor="#item of list | searchName : searchInput"
                     (click)="select(item)">
                    {{ item.name }}
                </div>
            </div>
        </div>
    `,
})
export class DropdownList {
    @Input() list: IDropdownListItem[] = [];
    @Input() placeholder: string = '';
    @Output() onSelect: EventEmitter<IDropdownListItem> = new EventEmitter<IDropdownListItem>();

    /* tslint:disable */
    private searchInput: string = '';
    /* tslint:enable */
    private dropdownIsVisible: boolean = false;

    select(item: IDropdownListItem): void {
        this.onSelect.emit(item);
    }

    inputFocus(): void {
        this.dropdownIsVisible = true;
    }

    InputBlur(): void {
        // 'blur' is firing faster then 'click' event
        // therefore I need a timeout to make it work
        setTimeout(() => this.dropdownIsVisible = false, 100);
    }
}
