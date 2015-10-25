interface ISubmenuChildItem {
    title: string;
    onclick: () => {};
    selected: boolean;
}

interface ISubmenuItem {
    title: string;
    onclick: () => {};
    action?: string;
    submenu: ISubmenuChildItem[];
}
