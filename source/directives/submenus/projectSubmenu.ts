/// <reference path="./submenu-interfaces.ts" />

namespace pmApp {
    'use strict';

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
        (
            $modal: any,
            projectModalHtmlLinkConstant: string,
            projectModalControllerConstant: string
        ) => {
            let link: any = (scope: any, el: angular.IRootElementService): void => {

                // handle click on item menu
                let itemClick: any = function(item: ISubmenuItem): any {
                    $modal.open({
                        templateUrl: projectModalHtmlLinkConstant,
                        controller: projectModalControllerConstant,
                        resolve: {
                            project: (): IProject => {
                                return scope.project;
                            },
                            action: (): string => {
                                return item.action;
                            }
                        }
                    });
                }.bind(scope);

                scope.menu = [
                    {
                        'title': 'Open',
                        'onclick': itemClick,
                        'action': ModalAction[ModalAction.Open],
                        'submenu': []
                    },
                    {
                        'title': 'Edit',
                        'onclick': itemClick,
                        'action': ModalAction[ModalAction.Edit],
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
            };
        }]);
}
