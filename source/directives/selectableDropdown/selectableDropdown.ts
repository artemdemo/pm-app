namespace pmApp {
    'use strict';

    interface IItem {
        id: any;
        name: string;
    }

    enum EMode {
        PassThrough,
        KeepValue
    }

    /**
     * Dropdown to select elements
     *
     * @attr
     * items - items list
     * disableInput - disable input condition
     * selectedTask - selected item object
     * nameProperty - property of the object where directive expects to find name (default is `name`)
     * mode - what to do with selected item:
     *      PassThrough - after selecting text wouldn't be shown text and selected icon wouldn't appear,
     *                    but `selectedTask` will keep the object
     *      KeepValue - will keep item name in <input>
     * placeholder - text that will be shown in input's placeholder
     *
     * @example
     * <selectable-dropdown
     *      items="tm.availableTasks"
     *      disable-input="tm.subtasks.length > 0"
     *      selected-task="tm.selectedParent"
     *      name-property="name"
     *      mode="KeepValue"
     *      placeholder="Choose parent task"></selectable-dropdown>
     */
    angular
        .module('pmApp')
        .directive('selectableDropdown', ['$timeout', ($timeout: angular.ITimeoutService): any => {
            let link: any = (scope: any, el: angular.IRootElementService, attr: angular.IAttributes): void => {

                let $listContainer: angular.IRootElementService = angular.element( el[0].querySelector('.selectable-dropdown__list') );
                let $input: angular.IRootElementService = el.find('input');
                let nameProperty: string = scope.nameProperty ? scope.nameProperty : 'name';

                scope.showSelectedIcon = EMode[scope.mode] === EMode[<string>'KeepValue'];

                $input.bind('focus', (): void => {
                    if (scope.items && scope.items.length > 0) {
                        $listContainer.addClass('selectable-dropdown__list_show');
                    }
                });

                $input.bind('blur', (): void => {

                    // 'blur' is firing faster then ng-click
                    $timeout(() => $listContainer.removeClass('selectable-dropdown__list_show'), 200);
                    if (!scope.selectedTask) {
                        scope.search = '';
                    }
                });

                $input.bind('keydown', (): void => {
                    scope.selectedTask = null;
                });

                scope.$watch('selectedTask', (newTask: IItem) => {
                    if (newTask && EMode[scope.mode] === EMode[<string>'KeepValue']) {
                        scope.search = newTask[nameProperty];
                    }
                });

                scope.selectItem = (item: IItem): void => {
                    scope.selectedTask = item;
                    $listContainer.removeClass('selectable-dropdown__list_show');
                };
            };

            return {
                link: link,
                templateUrl: 'html/selectableDropdown.html',
                scope: {
                    items: '=',
                    disableInput: '=',
                    selectedTask: '=',
                    nameProperty: '@',
                    label: '@',
                    placeholder: '@',
                    mode: '@'
                },
                restrict: 'E'
            };
        }]);
}
