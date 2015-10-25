/// <reference path="./submenu-interfaces.ts" />

namespace pmApp {
    'use strict';

    /**
     * Directive that handle opening of the submenu
     *
     */
    angular
        .module('pmApp')
        .directive('submenuOpenHandler', ['helper', (helper: any) => {
            let link: any = (scope: angular.IScope, el: angular.IRootElementService): void => {

                let $body: angular.IRootElementService = angular.element(document.body);
                let hideFunctionAttached: boolean = false;
                /* tslint:disable:no-var-keyword */
                var hideSubmenu: any = (event: Event): void => {
                    switch (true) {
                        case event && helper.hasClass(event.target, 'submenu-list_item-content'):
                            break;
                        case event && helper.hasClass(event.target, 'submenu-list_item'):
                            break;
                        default:
                            el.removeClass('active');
                            $body.unbind('click', hideSubmenu);
                            setTimeout(() => hideFunctionAttached = false);
                    }
                };
                /* tslint:enable:no-var-keyword */

                el.bind('click', () => {
                    if (!hideFunctionAttached) {
                        el.addClass('active');
                        setTimeout(() => $body.bind('click', hideSubmenu));
                        hideFunctionAttached = true;
                    }
                });

            };
            return {
                link: link,
                scope: {},
                restrict: 'A'
            };
        }]);
}
