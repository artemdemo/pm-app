namespace pmApp {

    angular
        .module('pmApp')
        .constant('taskModalControllerConstant', 'taskModalController as tm')
        .constant('taskModalHtmlLinkConstant', 'html/taskModal.html')

        .constant('projectModalControllerConstant', 'projectModalController as pm')
        .constant('projectModalHtmlLinkConstant', 'html/projectModal.html');
}