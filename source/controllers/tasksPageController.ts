namespace pmApp {
    'use strict';

    class TasksPageController {
        public static $inject: string[] = [
            '$scope',
            '$modal',
            'tasksService',
            'taskModalHtmlLinkConstant',
            'taskModalControllerConstant'
        ];

        public tasks: ITask[];

        constructor (
            public $scope: angular.IScope,
            public $modal: any,
            public tasksService: any,
            public taskModalHtmlLinkConstant: string,
            public taskModalControllerConstant: string
        ) {

            tasksService.getTasks()
                .then(
                    (newTasks: ITask[]) => this.tasks = newTasks,
                    (newTasks: ITask[]) => this.tasks = newTasks
                );

            $scope.$on('update-tasks-list', () => {
                tasksService.getTasks()
                    .then((newTasks: ITask[]) => this.tasks = newTasks);
            });
        }

        /**
         * Open modal to create new task
         */
        public newTask(): void {
            this.$modal.open({
                templateUrl: this.taskModalHtmlLinkConstant,
                controller: this.taskModalControllerConstant,
                resolve: {
                    task: (): any => null,
                    action: (): any => ModalAction.New
                }
            }).result
                .then(() => {
                    this.tasksService
                        .getTasks().then((newTasks: ITask[]) => this.tasks = newTasks);
                });
        }
    }

    angular
        .module('pmApp')
        .controller('tasksPageController', TasksPageController);
}
