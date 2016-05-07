/**
 * General interface for generic components, that can work with
 * both tasks and projects, like DropdownList
 */
export interface IGeneralListItem {
    id: any;
    name: string;
    done?: boolean;
}
