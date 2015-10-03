/// <reference path="./submenu-interfaces.ts" />

module pmApp {

    /**
     * Task submenu directive
     * Handle functionality of submenu fo single task
     *
     * @usage
     *    in DOM just add tag <task-submenu></task-submenu>
     *    The rest will be handled by directive
     */
    angular
        .module('pmApp')
        .directive('taskSubmenu', [function(){
            let link = (scope, el, attr) => {

                // Handle click on item menu
                let itemClick = function(item: SubmenuItem) {
                    console.log(this)
                }.bind(scope);


                // Handle click on subitem menu
                let subitemClick = function(subitem: SubmenuChildItem, parentItem: SubmenuItem) {
                    parentItem.submenu = parentItem.submenu.map(function(item: SubmenuChildItem){
                        item.selected = false;
                        return item;
                    });
                    subitem.selected = true;
                }.bind(scope);

                scope.menu = [
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
                scope: {},
                restrict: 'E'
            }
        }]);

}