namespace pmApp {
    'use strict';

    angular
        .module('pmApp')
        .directive('mainMenu', [() => {
            let link: any = () => {
                return;
            };
            return {
                link: link,
                templateUrl: 'html/mainMenu.html',
                scope: {},
                restrict: 'E'
            };
        }]);

}
