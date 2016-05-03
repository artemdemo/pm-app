import {Pipe} from 'angular2/core';

export enum filterTasksType {
    all,
    active,
    completed
}

@Pipe({
    name: 'filterTasks',
})
export class FilterTasks {
    transform(values: any, [term]: any): any[] {
        return values.filter((item) => {
            switch (term) {
                case filterTasksType.active:
                    return item.done === false;
                case filterTasksType.completed:
                    return item.done === true;
                default:
                case filterTasksType.all:
                    return true;
            }
        });
    }
}
