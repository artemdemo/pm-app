module pmApp {
    class apiService {
        public static $inject = [];

        private apiBaseUrl = '../api/public';

        constructor() {}

        /**
         * Return absolute url based on given relative
         * @param relativeUrl
         * @returns {string}
         */
        getAbsoluteUrl (relativeUrl:string):string {
            return this.apiBaseUrl + relativeUrl;
        }
    }

    angular
        .module('pmApp')
        .service('apiService', apiService);
}