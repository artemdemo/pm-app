/// <reference path="./submenu-interfaces.ts" />

module pmApp {

    /**
     * Task submenu directive
     * Handle functionality of submenu fo single task
     *
     * @attr
     *     data-task {=} Should contain task object
     * @usage
     *    in DOM just add tag <task-submenu data-task=""></task-submenu>
     *    The rest will be handled by directive
     */
    angular
        .module('pmApp')
        .directive('taskSubmenu', ['$modal', function($modal){
            let link = (scope, el, attr) => {

                /**
                 * Handle click on item menu
                 * Opens modal with task information
                 * @param item {SubmenuItem} - iem from the scope.menu object
                 * @param $event
                 */
                let itemClick = function(item: SubmenuItem, $event) {
                    $modal.open({
                        templateUrl: 'html/taskModal.html',
                        controller: 'taskModalController as tm',
                        resolve: {
                            task: function () {
                                return scope.task;
                            }
                        }
                    });
                }.bind(scope);


                /**
                 * Handle click on subitem menu
                 * @param subitem {SubmenuChildItem}
                 * @param parentItem {SubmenuItem}
                 * @param $event
                 */
                let subitemClick = function(subitem: SubmenuChildItem, parentItem: SubmenuItem, $event) {
                    parentItem.submenu = parentItem.submenu.map(function(item: SubmenuChildItem){
                        item.selected = false;
                        return item;
                    });
                    subitem.selected = true;
                }.bind(scope);


                scope.menu = [
                    {
                        'title': 'Open',
                        'onclick': itemClick,
                        'submenu': []
                    },
                    {
                        'title': 'Edit',
                        'onclick': itemClick,
                        'submenu': []
                    },
                    {
                        'title': 'Change status:',
                        'submenu': [
                            {
                                'title': 'ToDo',
                                'selected': false,
                                'onclick': subitemClick
                            },
                            {
                                'title': 'In Process',
                                'selected': false,
                                'onclick': subitemClick
                            },
                            {
                                'title': 'Pending',
                                'selected': false,
                                'onclick': subitemClick
                            },
                            {
                                'title': 'Done',
                                'selected': false,
                                'onclick': subitemClick
                            }
                        ]
                    }
                ];
            };
            return {
                link: link,
                templateUrl: 'html/submenu.html',
                scope: {
                    task: '='
                },
                restrict: 'E'
            }
        }]);

}