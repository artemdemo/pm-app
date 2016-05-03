import {Component, Input} from '@angular/core';

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
    `,
})
export class LoadingSpinner {
    @Input() color: string = LoadingSpinnerColors[LoadingSpinnerColors.black];
    private spinnerClass: string;

    ngOnInit(): void {
        this.spinnerClass = `loading-spinner_${this.color}`;
    }
}
