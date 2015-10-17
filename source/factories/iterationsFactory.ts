namespace pmApp {
    'use strict';

    let iterationsFactory: any = ($resource: any, apiService: any): any => {
        return $resource(apiService.getAbsoluteUrl('/iterations/:id'));
    };

    angular
        .module('pmApp')
        .factory('iterationsFactory', ['$resource', 'apiService', iterationsFactory]);
}
