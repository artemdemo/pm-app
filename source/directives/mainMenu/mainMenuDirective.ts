module pmApp {

    angular
        .module('pmApp')
        .directive('mainMenu', [function(){
            let link = () => {

            };
            return {
                link: link,
                templateUrl: 'html/mainMenu.html',
                scope: {},
                restrict: 'E'
            }
        }]);

}