module pmApp {

    class projectModalController {
        public static $inject = [
            '$scope',
            '$modalInstance',
            'tasksService',
            'projectsService',
            'project',
            'action'
        ];

        public projectEditCopy: Project;
        public selectedTask: Task;
        public availableTasks: Task[] = [];

        /**
         *
         * @param $scope
         * @param $modalInstance
         * @param tasksService
         * @param projectsService
         * @param project
         * @param action {string} - will contain action that user want apply on the project
         *      Possible values:
         *      'new' - adding new project
         *      'edit' - editing project
         *      'open' - viewing project data
         */
        constructor (
            public $scope,
            public $modalInstance,
            public tasksService,
            public projectsService,
            public project,
            public action
        ) {

            if ( action == 'new' ) {
                this.projectEditCopy = projectsService.getEmptyProject();
            } else {
                this.projectEditCopy = angular.copy(project);
            }

            tasksService.getTasks()
                .then((tasks) => this.availableTasks = tasks);

        }

        public edit() {
            this.action = 'edit';
        }

        public cancel () {
            this.$modalInstance.dismiss('cancel');
        }

    }

    angular
        .module('pmApp')
        .controller('projectModalController', projectModalController)
}