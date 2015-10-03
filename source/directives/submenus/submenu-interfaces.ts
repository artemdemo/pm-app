interface SubmenuChildItem {
    title: string;
    onclick: () => {};
    selected: boolean;
}

interface SubmenuItem {
    title: string;
    onclick: () => {};
    action?: string;
    submenu: SubmenuChildItem[];
}