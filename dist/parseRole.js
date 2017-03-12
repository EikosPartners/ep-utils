'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _module,
    _ = require('lodash');
var ROLE_KEY = 'roleid';

function parse(metadata, userRoles) {
    var key = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ROLE_KEY;

    if (_.isArray(metadata)) {
        return parseArray(metadata, userRoles, key);
    } else {
        return parseObject(metadata, userRoles, key);
    }
}

function parseObject(metadata, userRoles, key) {

    if (metadata[key]) {
        if (!applyRule(userRoles, metadata[key], metadata)) {
            return null;
        }

        delete metadata[key];
    }

    for (var property in metadata) {
        if (metadata.hasOwnProperty(property)) {
            if (metadata[property] === null) {
                continue;
            }
            if (_.isArray(metadata[property])) {
                metadata[property] = parseArray(metadata[property], userRoles, key);
            } else if (_typeof(metadata[property]) === "object" && metadata[property] !== null) {
                metadata[property] = parseObject(metadata[property], userRoles, key);
            }

            if (metadata[property] === null) {
                delete metadata[property];
            }
        }
    }

    return metadata;
}

function parseArray(metadata, userRoles, key) {
    metadata = _(metadata).map(function (obj, index) {
        if (_.isArray(obj)) {
            return parseArray(obj, userRoles, key);
        } else if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === "object" && obj !== null) {
            return parseObject(obj, userRoles, key);
        } else {
            return obj;
        }
    }).filter(function (obj) {
        return obj !== null;
    }).value();
    return metadata;
}

var ruleFunctions = {
    insert: function insert(obj, data) {
        _.merge(obj, data);
    }
};

function applyRule(userRoles, ruleObj, obj) {
    if (_.isArray(ruleObj)) {
        return _.intersection(userRoles, ruleObj).length !== 0;
    }
    if (_.intersection(ruleObj.applyForRoles, userRoles).length !== 0) {
        ruleFunctions[ruleObj.type](obj, ruleObj.data);
    }
    return true;
}

module.exports = _module = {
    parse: parse
};
//# sourceMappingURL=parseRole.js.map