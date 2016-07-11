'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _module,
    _ = require('lodash'),
    fsw = require('./fsWrapper');

var ROLE_KEY = 'roleid';

function parse(metadata, userRoles) {
    if (_.isArray(metadata)) {
        return parseArray(metadata, userRoles);
    } else {
        return parseObject(metadata, userRoles);
    }
}

function parseObject(metadata, userRoles) {
    if (metadata[ROLE_KEY]) {
        if (!applyRule(userRoles, metadata[ROLE_KEY], metadata)) {
            return null;
        }

        delete metadata[ROLE_KEY];
    }

    for (var property in metadata) {
        if (metadata.hasOwnProperty(property)) {
            if (_.isArray(metadata[property])) {
                metadata[property] = parseArray(metadata[property], userRoles);
            } else if (_typeof(metadata[property]) === "object" && metadata[property] !== null) {
                metadata[property] = parseObject(metadata[property], userRoles);
            }

            if (metadata[property] === null) {
                delete metadata[property];
            }
        }
    }

    return metadata;
}

function parseArray(metadata, userRoles) {
    metadata = _(metadata).map(function (obj, index) {
        if (_.isArray(obj)) {
            return parseArray(obj, userRoles);
        } else if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === "object" && obj !== null) {
            return parseObject(obj, userRoles);
        } else {
            return obj;
        }
    }).filter(function (obj) {
        return obj !== null;
    }).value();
    return metadata.length === 0 ? null : metadata;
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