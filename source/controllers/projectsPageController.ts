module pmApp {

    class projectsPageController {
        public static $inject = [
            '$scope',
            '$modal',
            'projectsService',
            'projectModalHtmlLinkConstant',
            'projectModalControllerConstant'
        ];

        public projects;

        constructor (
            public $scope,
            public $modal,
            public projectsService,
            public projectModalHtmlLinkConstant,
            public projectModalControllerConstant
        ) {

            projectsService.getProjects()
                .then(
                (newProjects) => this.projects = newProjects,
                (newProjects) => this.projects = newProjects
            );
        }

        /**
         * Open modal fr adding new project
         */
        public newProject () {
            this.$modal.open({
                templateUrl: this.projectModalHtmlLinkConstant,
                controller: this.projectModalControllerConstant,
                resolve: {
                    project: function () {
                        return null;
                    },
                    action: function() {
                        return 'new'
                    }
                }
            });
        }
}

angular
    .module('pmApp')
    .controller('projectsPageController', projectsPageController)
}