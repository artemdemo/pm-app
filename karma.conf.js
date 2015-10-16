// Karma configuration
// Generated on Mon Oct 12 2015 22:15:54 GMT+0300 (MSK)

module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            'front/js/angular.min.js',
            'node_modules/angular-mocks/angular-mocks.js',
            'front/js/angular-resource.min.js',
            'front/js/angular-ui-router.min.js',
            'front/js/angular-sanitize.min.js',
            'front/js/mm-foundation-tpls.min.js',
            'front/js/moment.min.js',
            'front/js/app.js',
            'front/**/*.html',
            'test/**/*spec.js'
        ],


        // list of files to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'front/**/*.html': ['ng-html2js'],

            /*
             * Note:
             * babel and karma-babel-preprocessor only convert ES6 modules to CommonJS/AMD/SystemJS/UMD.
             * If you choose CommonJS, you still need to resolve and concatenate CommonJS modules on your own.
             * We recommend karma-browserify + babelify or webpack + babel-loader in such cases.
             *
             * @source https://github.com/babel/karma-babel-preprocessor
             */
            'test/**/*spec.js': ['babel']
        },

        ngHtml2JsPreprocessor: {
            // strip this from the file path
            stripPrefix: 'front/html/',
            // prepend this to the
            prependPrefix: 'html/',

            moduleName: 'my.templates'
        },

        babelPreprocessor: {
            options: {
                sourceMap: 'inline'
            },
            filename: function (file) {
                return file.originalPath.replace(/\.js$/, '.es5.js');
            },
            sourceFileName: function (file) {
                return file.originalPath;
            }
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['verbose', 'html'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        // browsers: ['Chrome'],
        browsers: ['PhantomJS'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false
    })
};
