module pmApp {

    let iterationsFactory = ($resource, apiService) => {
        return $resource(apiService.getAbsoluteUrl('/iterations/:id'));
    };

    angular
        .module('pmApp')
        .factory('iterationsFactory', ['$resource', 'apiService', iterationsFactory])
}