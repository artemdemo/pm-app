namespace pmApp {
    'use strict';

    class ProjectsPageController {
        public static $inject: string[] = [
            '$scope',
            '$modal',
            'projectsService',
            'projectModalHtmlLinkConstant',
            'projectModalControllerConstant'
        ];

        public projects: IProject[];

        constructor (
            public $scope: angular.IScope,
            public $modal: any,
            public projectsService: any,
            public projectModalHtmlLinkConstant: string,
            public projectModalControllerConstant: string
        ) {

            projectsService.getProjects()
                .then((newProjects: IProject[]) => this.projects = newProjects);

            $scope.$on('update-projects-list', () => {
                console.log('update-projects-list');
                projectsService.getProjects()
                    .then((newProjects: IProject[]) => {
                        this.projects = newProjects;
                        console.log(this.projects);
                    });
            });
        }

        /**
         * Open modal fr adding new project
         */
        public newProject(): void {
            this.$modal.open({
                templateUrl: this.projectModalHtmlLinkConstant,
                controller: this.projectModalControllerConstant,
                resolve: {
                    project: (): any => null,
                    action: (): any => 'new'
                }
            });
        }
    }

    angular
        .module('pmApp')
        .controller('projectsPageController', ProjectsPageController);
}
