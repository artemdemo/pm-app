import {Component, Input, Output, EventEmitter} from '@angular/core';
import {SearchName} from '../pipes/SearchName';
import {IGeneralListItem} from '../interfaces/IGeneralListItem';

@Component({
    selector: 'dropdown-list',
    directives: [],
    pipes: [SearchName],
    template: `
        <div class="dropdown-list">
            <input class="flat-input dropdown-list__input"
                   (focus)="inputFocus()"
                   (blur)="InputBlur()"
                   [(ngModel)]="searchInput"
                   [placeholder]="placeholder">
            <div class="dropdown-list-items"
                 [ngClass]="{'dropdown-list-items_show': dropdownIsVisible}"
                 *ngIf="list.length > 0">
                <div class="dropdown-list-items__child"
                     *ngFor="let item of list | searchName : searchInput"
                     (click)="select(item)">
                    {{ item.name }}
                </div>
            </div>
        </div>
    `,
})
export class DropdownList {
    @Input() list: IGeneralListItem[] = [];
    @Input() placeholder: string = '';
    @Output() onSelect: EventEmitter<IGeneralListItem> = new EventEmitter<IGeneralListItem>();

    /* tslint:disable */
    // tslint don't understand that I'm using searchInput inside of template
    // (but not inside of class)
    private searchInput: string = '';
    /* tslint:enable */
    private dropdownIsVisible: boolean = false;

    select(item: IGeneralListItem): void {
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
