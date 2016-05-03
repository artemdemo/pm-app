import {Pipe} from '@angular/core';

@Pipe({
    name: 'searchName',
})
export class SearchName {
    transform(values: any, name: any): any[] {
        return values.filter((item) => {
            return item.name.toLowerCase().indexOf(name.toLowerCase()) > -1;
        });
    }
}
