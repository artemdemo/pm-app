module pmApp {

    angular
        .module('pmApp')
        .directive('selectTask', ['$timeout',function($timeout){
            let link = (scope, el, attr) => {
                var $listContainer = angular.element( el[0].querySelector('.select-task__list') );
                var inputEl = el.find('input');

                inputEl.bind('focus',function(){
                    $listContainer.addClass('select-task__list_show');
                });

                inputEl.bind('blur',function() {

                    // 'blur' is firing faster then ng-click
                    $timeout(function(){ $listContainer.removeClass('select-task__list_show') }, 200);
                });

                scope.selectItem = function( item ){
                    scope.search = item.name;
                    scope.selectedTask = item;
                    $listContainer.removeClass('select-task__list_show');
                }
            };

            return {
                link: link,
                templateUrl: 'html/selectTask.html',
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