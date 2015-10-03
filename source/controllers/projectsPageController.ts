module pmApp {

    class projectsPageController {
        public static $inject = [
            '$scope',
            'projectsService'
        ];

        public projects;

        constructor (public $scope, public projectsService) {
            projectsService.getProjects()
                .then(
                (newProjects) => this.projects = newProjects,
                (newProjects) => this.projects = newProjects
            );
        }
}

angular
    .module('pmApp')
    .controller('projectsPageController', projectsPageController)
}