/// <reference path="./submenu-interfaces.ts" />

module pmApp {

    /**
     * Directive that handle opening of the submenu
     *
     */
    angular
        .module('pmApp')
        .directive('submenuOpenHandler', ['helper', function(helper){
            let link = (scope, el, attr) => {

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

            };
            return {
                link: link,
                scope: {},
                restrict: 'A'
            }
        }]);

}