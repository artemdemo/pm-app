import {Component, Input} from 'angular2/core';

export enum LoadingSpinnerColors {
    black,
    white,
    blue,
    green,
    red
}

@Component({
    selector: 'loading-spinner',
    template: `
        <span class="loading-spinner" [ngClass]="spinnerClass"></span>
    `
})
export class LoadingSpinner {
    @Input() color: string = LoadingSpinnerColors[LoadingSpinnerColors.black];
    
    spinnerClass: string;

    constructor() {}
    
    ngOnInit() {
        this.spinnerClass = `loading-spinner_${this.color}`;
    }
}
