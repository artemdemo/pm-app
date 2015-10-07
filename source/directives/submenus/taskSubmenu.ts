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
        .directive('taskSubmenu',
        [
            '$modal',
            'taskModalHtmlLinkConstant',
            'taskModalControllerConstant',
        function(
            $modal,
            taskModalHtmlLinkConstant,
            taskModalControllerConstant
        ) {
            let link = (scope, el, attr) => {

                /**
                 * Handle click on item menu
                 * Opens modal with task information
                 * @param item {SubmenuItem} - iem from the scope.menu object
                 * @param $event
                 */
                let itemClick = function(item: SubmenuItem, $event) {
                    $modal.open({
                        templateUrl: taskModalHtmlLinkConstant,
                        controller: taskModalControllerConstant,
                        resolve: {
                            task: function () {
                                return scope.task;
                            },
                            action: function() {
                                return item.action
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
                    parentItem.submenu = parentItem.submenu.map((item: SubmenuChildItem) => {
                        item.selected = false;
                        return item;
                    });
                    subitem.selected = true;
                }.bind(scope);


                scope.menu = [
                    {
                        'title': 'Open',
                        'onclick': itemClick,
                        'action': 'open',
                        'submenu': []
                    },
                    {
                        'title': 'Edit',
                        'onclick': itemClick,
                        'action': 'edit',
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