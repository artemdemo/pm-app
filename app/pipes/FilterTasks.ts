import {Pipe} from '@angular/core';

export enum filterTasksType {
    all,
    active,
    completed
}

@Pipe({
    name: 'filterTasks',
})
export class FilterTasks {
    transform(values: any, taskType: any): any[] {
        return values.filter((item) => {
            switch (taskType) {
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
