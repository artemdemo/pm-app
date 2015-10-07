module pmApp {

    class projectModalController {
        public static $inject = [
            '$scope',
            '$modalInstance',
            'projectsService',
            'project',
            'action'
        ];

        public projectEditCopy: Project;

        /**
         *
         * @param $scope
         * @param $modalInstance
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
            public projectsService,
            public project,
            public action
        ) {

            if ( action == 'new' ) {
                this.projectEditCopy = projectsService.getEmptyProject();
            } else {
                this.projectEditCopy = angular.copy(project);
            }
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