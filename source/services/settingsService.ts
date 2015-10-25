namespace pmApp {
    'use strict';

    interface IMetatag {
        id: any;
        name: string;
    }

    interface ISettings {
        metatags: {
            priority: IMetatag[]
        };
    }

    export enum EMetatag {
        priority,
        status
    }

    class SettingsService {
        public static $inject: string[] = [
            '$http',
            '$q',
            'apiService'
        ];

        private settings: ISettings = null;
        private settingsLoadingPromise: angular.IPromise<ISettings> = null;

        constructor(
            public $http: angular.IHttpService,
            public $q: angular.IQService,
            public apiService: any
        ) {}

        /**
         * Loading settings
         * @returns {IPromise<ISettings[]>}
         */
        public loadSettings(): angular.IPromise<ISettings> {
            let deferred: angular.IDeferred<ISettings> = this.$q.defer();

            this.$http.get(this.apiService.getAbsoluteUrl('/settings'))
                .then(
                (result: any) => {
                    this.settings = result.data;
                    deferred.resolve(result.data);
                },
                (data: any) => deferred.reject(data)
            );

            this.settingsLoadingPromise = deferred.promise;

            return deferred.promise;
        }


        /**
         * Return metatag values array
         * @param metatag
         * @returns {IPromise<IMetatag[]>}
         */
        public getMetatag(metatag: EMetatag): angular.IPromise<IMetatag[]> {
            let deferred: angular.IDeferred<IMetatag[]> = this.$q.defer();

            this.$q.all([
                this.settingsLoadingPromise
            ]).then(
                () => deferred.resolve(this.settings.metatags[EMetatag[metatag]]),
                () => deferred.reject()
            );

            return deferred.promise;
        }
    }

    angular
        .module('pmApp')
        .service('settingsService', SettingsService);
}
