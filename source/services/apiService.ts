namespace pmApp {
    'use strict';

    class ApiService {
        public static $inject: string[] = [];

        private apiBaseUrl: string;

        constructor() {
            switch (true) {
                case /localhost/.exec(location.hostname) != null:
                    this.apiBaseUrl = 'http://localhost/pm/api/public';
                    break;
                default:
                    this.apiBaseUrl = '../api/public';
            }
        }

        /**
         * Return absolute url based on given relative
         * @param relativeUrl
         * @returns {string}
         */
        public getAbsoluteUrl(relativeUrl: string): string {
            return this.apiBaseUrl + relativeUrl;
        }
    }

    angular
        .module('pmApp')
        .service('apiService', ApiService);
}
