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
        .directive('taskSubmenu', ['$modal', 'helper', function($modal, helper){
            let link = (scope, el, attr) => {

                /**
                 * Handle click on item menu
                 * Opens modal with task information
                 * @param item {SubmenuItem} - iem from the scope.menu object
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
                    hideSubmenu(null);
                }.bind(scope);


                // Handle click on subitem menu
                let subitemClick = function(subitem: SubmenuChildItem, parentItem: SubmenuItem, $event) {
                    parentItem.submenu = parentItem.submenu.map(function(item: SubmenuChildItem){
                        item.selected = false;
                        return item;
                    });
                    subitem.selected = true;
                }.bind(scope);

                let $body = angular.element(document.body);
                var hideFunctionAttached = false;
                var hideSubmenu = function(event) {
                    switch (true) {
                        case event && helper.hasClass(event.target, 'submenu-list_item-content'):
                            break;
                        case event && helper.hasClass(event.target, 'submenu-list_item'):
                            break;
                        default:
                            el.removeClass('active');
                            $body.unbind('click', hideSubmenu);
                            setTimeout(function(){
                                hideFunctionAttached = false;
                            });
                    }
                };

                el.bind('click', function(){
                    if (!hideFunctionAttached) {
                        el.addClass('active');
                        setTimeout(function(){
                            $body.bind('click', hideSubmenu)
                        });
                        hideFunctionAttached = true;
                    }
                });

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