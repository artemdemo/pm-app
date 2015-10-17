/// <reference path="./submenu-interfaces.ts" />

namespace pmApp {

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
        .directive('projectSubmenu', [
            '$modal',
            'projectModalHtmlLinkConstant',
            'projectModalControllerConstant',
        function(
            $modal,
            projectModalHtmlLinkConstant,
            projectModalControllerConstant
        ){
            let link = (scope, el, attr) => {

                // Handle click on item menu
                let itemClick = function(item: SubmenuItem) {
                    $modal.open({
                        templateUrl: projectModalHtmlLinkConstant,
                        controller: projectModalControllerConstant,
                        resolve: {
                            project: function () {
                                return scope.project;
                            },
                            action: function() {
                                return item.action
                            }
                        }
                    });
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
                    }
                ];
            };
            return {
                link: link,
                templateUrl: 'html/submenu.html',
                scope: {
                    project: '='
                },
                restrict: 'E'
            }
        }]);

}