const vm = require('vm');
const fs = require('fs');
const path = require('path');

/**
 * Helper for unit testing:
 * - load module with mocked dependencies
 * - allow accessing private state of the module
 *
 * @link https://www.joezimjs.com/javascript/dependency-injection-with-node-js/
 * @param {string} filePath Absolute path to module (file to load)
 * @param {Object=} mocks Hash of mocked dependencies
 */
const loadModule = function(filePath, mocks = {}) {
    // this is necessary to allow relative path modules within loaded file
    // i.e. requiring ./some inside file /a/b.js needs to be resolved to /a/some
    const resolveModule = function(module) {
        if (module.charAt(0) !== '.') return module;
        return path.resolve(path.dirname(filePath), module);
    };
    const exports = {};

    // All tests will run in separate context,
    // It means we need to define all global objects that are needed for test
    const context = {
        // eslint-disable-next-line import/no-dynamic-require
        require: name => mocks[name] || require(resolveModule(name)),
        Buffer,
        console,
        exports,
        module: {
            exports,
        },
    };
    vm.runInNewContext(fs.readFileSync(filePath), context);
    return context.module.exports;
};

module.exports = loadModule;
