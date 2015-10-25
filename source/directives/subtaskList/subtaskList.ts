namespace pmApp {
    'use strict';

    angular
        .module('pmApp')
        .directive('subtaskList', [(): any => {
            let link: any = (scope: any, el: angular.IRootElementService, attr: angular.IAttributes): void => {

                scope.removeSubtask = (subtask: ITask): void => {
                    for (var i: number = 0, len: number = scope.subtasks.length; i < len; i++) {
                        if (scope.subtasks[i].id === subtask.id) {
                            scope.subtasks.splice(i, 1);
                            break;
                        }
                    }
                };
            };

            return {
                link: link,
                templateUrl: 'html/subtaskList.html',
                scope: {
                    subtasks: '=',
                    title: '@',
                    hideRemoveBtn: '=',
                    hideSubmenuBtn: '='
                },
                restrict: 'E'
            };
        }]);
}
