namespace pmApp {
    'use strict';

    interface IItem {
        name: string;
    }

    angular
        .module('pmApp')
        .directive('selectableDropdown', ['$timeout', ($timeout: angular.ITimeoutService): any => {
            let link: any = (scope: any, el: angular.IRootElementService, attr: angular.IAttributes): void => {
                let $listContainer: angular.IRootElementService = angular.element( el[0].querySelector('.selectable-dropdown__list') );
                let $input: angular.IRootElementService = el.find('input');

                $input.bind('focus', (): void => {
                    if (scope.items && scope.items.length > 0) {
                        $listContainer.addClass('selectable-dropdown__list_show');
                    }
                });

                $input.bind('blur', (): void => {

                    // 'blur' is firing faster then ng-click
                    $timeout(() => $listContainer.removeClass('selectable-dropdown__list_show'), 200);
                });

                scope.selectItem = (item: IItem): void => {
                    scope.search = '';
                    scope.selectedTask = item;
                    $listContainer.removeClass('selectable-dropdown__list_show');
                };
            };

            return {
                link: link,
                templateUrl: 'html/selectableDropdown.html',
                scope: {
                    items: '=',
                    selectedTask: '=',
                    label: '@',
                    placeholder: '@'
                },
                restrict: 'E'
            };
        }]);
}
