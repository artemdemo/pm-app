/// <reference path="./submenu-interfaces.ts" />

module pmApp {

    /**
     * Project submenu directive
     * Handle functionality of submenu of single project
     *
     * @usage
     *    in DOM just add tag <project-submenu></project-submenu>
     *    The rest will be handled by directive
     */
    angular
        .module('pmApp')
        .directive('projectSubmenu', [function(){
            let link = (scope, el, attr) => {

                // Handle click on item menu
                let itemClick = function(item: SubmenuItem) {
                    console.log(this)
                }.bind(scope);

                scope.menu = [
                    {
                        'title': 'Edit',
                        'onclick': itemClick,
                        'submenu': []
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