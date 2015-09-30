module pmApp {

    class projectsPageController {
        public static $inject = [
            '$scope',
            'projectsService'
        ];

        public projects;
        public dragControlListeners;

        constructor (public $scope, public projectsService) {
            projectsService.getProjects()
                .then(
                (newProjects) => this.projects = newProjects,
                (newProjects) => this.projects = newProjects
            );

            this.dragControlListeners = {
                accept: function (sourceItemHandleScope, destSortableScope) {return true}, //override to determine drag is allowed or not. default is true.
                itemMoved: function (event) {},
                orderChanged: function(event) {
                }.bind(this),
            };
        }
}

angular
    .module('pmApp')
    .controller('projectsPageController', projectsPageController)
}