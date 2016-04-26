import {Pipe} from 'angular2/core';

@Pipe({
    name: 'searchName',
})
export class SearchName {
    transform(values: any, [term]: any): any[] {
        return values.filter((item) => {
            return item.name.toLowerCase().indexOf(term.toLowerCase()) > -1;
        });
    }
}
