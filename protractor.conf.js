exports.config = {
    baseUrl: 'http://localhost:8000/',
    specs: ['app/test/e2e/createTask.spec.js'],
    directConnect: true,
    exclude: [],
    multiCapabilities: [{
        browserName: 'chrome'
    }],
    allScriptsTimeout: 110000,
    getPageTimeout: 100000,
    framework: 'jasmine2',
    jasmineNodeOpts: {
        isVerbose: true,
        showColors: true,
        includeStackTrace: false,
        defaultTimeoutInterval: 400000
    },

    /**
     * ng2 related configuration
     *
     * useAllAngular2AppRoots: tells Protractor to wait for any angular2 apps on the page instead of just the one matching
     * `rootEl`
     *
     */
    useAllAngular2AppRoots: true
};
