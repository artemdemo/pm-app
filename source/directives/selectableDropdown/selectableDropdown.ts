namespace pmApp {

    angular
        .module('pmApp')
        .directive('selectableDropdown', ['$timeout',function($timeout){
            let link = (scope, el, attr) => {
                var $listContainer = angular.element( el[0].querySelector('.selectable-dropdown-task__list') );
                var inputEl = el.find('input');

                inputEl.bind('focus',function(){
                    $listContainer.addClass('selectable-dropdown__list_show');
                });

                inputEl.bind('blur',function() {

                    // 'blur' is firing faster then ng-click
                    $timeout(function(){ $listContainer.removeClass('selectable-dropdown__list_show') }, 200);
                });

                scope.selectItem = function( item ){
                    scope.search = item.name;
                    scope.selectedTask = item;
                    $listContainer.removeClass('selectable-dropdown__list_show');
                }
            };

            return {
                link: link,
                templateUrl: 'html/selectableDropdown.html',
                scope: {
                    tasks: '=',
                    selectedTask: '=',
                    label: '@',
                    placeholder: '@'
                },
                restrict: 'E'
            }
        }]);

}