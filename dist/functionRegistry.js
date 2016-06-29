'use strict';

function functionRegistry() {
    var dictionary = {};

    // will set the value on an existing observable

    function register(key, func) {
        dictionary[key] = func;
    }

    function get(key) {
        var func = dictionary[key];
        if (func) {
            return func;
        }
    }
    function remove(key) {
        if (dictionary[key]) {
            delete dictionary[key];
        }
    }

    return {
        register: register,
        get: get,
        remove: remove,
        dictionary: dictionary
    };
}

function invoke(functionName, data, options) {
    // IS_MOCK needs to be true in prototype and undefined or false in taskflow to make it Mock
    // if IS_SERVICE_MOCK is false, then dont use mock keyword
    // set IS_SERVICE_MOCK to false explicitly when testing, leave it undefined for IS_MOCK to work as desired in protoype and portal
    var mockKey = window.IS_MOCK && window.IS_SERVICE_MOCK !== false ? 'mock.' : '',
        func;

    if (functionName) {
        func = registry.get(mockKey + functionName);
        if (func) {
            return func.apply(null, Array.prototype.slice.call(arguments, 1));
        }
    }
    return data;
}

// create instance
var registry = functionRegistry();

module.exports = {
    register: registry.register,
    get: registry.get,
    remove: registry.remove,
    dictionary: registry.dictionary,
    invoke: invoke
};
//# sourceMappingURL=functionRegistry.js.map