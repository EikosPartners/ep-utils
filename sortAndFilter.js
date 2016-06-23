var _module,
    utils = require('./dataUtils'),
    _ = require('lodash'),
    fsw = require('./fsWrapper'),
    fs = require('fs');


var compare = {
    '=': function (l, r) {
        return l == r; //use unstrict comparisions so strings can be compared with numbers
    },
    '!=': function (l, r) {
        return l != r;
    },
    '<': function (l, r) {
        return Number(l) < Number(r);
    },
    '>': function (l, r) {
        return Number(l) > Number(r);
    },
    '<=': function (l, r) {
        return Number(l) <= Number(r);
    },
    '>=': function (l, r) {
        return Number(l) >= Number(r);
    },
    'minDate': function (l, r) {
        return new Date(l) >= new Date(r);
    },
    'maxDate': function (l, r) {
        return new Date(l) <= new Date(r);
    },
    'in': function(l, r) {
      return r.indexOf(l) >-1 ;
    },
    'contains': function (l, r) {
        //console.log("contains", arguments);
        return Array.isArray(l) || typeof l === "string" ? l.indexOf(r) !== -1 : false;
    },
    'notcontains': function (l, r) {
        //console.log("notcontains", arguments);
        return Array.isArray(l) || typeof l === "string" ? l.indexOf(r) === -1 : false;
    },
    'containsatleastone': function (l, r) {
        //console.log("containsatleastone", arguments);
        if (!Array.isArray(l) || !Array.isArray(r)) return false;
        return r.some(function (i) {
            return l.indexOf(i) !== -1;
        });
    },
    "startsWithCI": function(l, r) {
        return String(l).toUpperCase().indexOf(String(r).toUpperCase()) === 0;
    },
    '': function () {
        return true;
    }
};

module.exports = _module = {
    get_type: function (fields, field) {
        for (var i = 0; i < fields.length; i++) {
            if (fields[i].id === field) {
                return fields[i].type;
            }
        }
    },
    sort: function (data, type, sort_column, sort_order) {
        var asc;
        if (sort_column != null) {
            asc = (sort_order == null || sort_order === true || sort_order.toUpperCase() !== 'DESC') ? 1 : -1;
            data = data.sort(function (a, b) {
                var result;
                if (a[sort_column] === undefined) {
                    result = 0;
                }
                else {
                    switch (type) {
                        case "number":
                            result = Number(a[sort_column]) - Number(b[sort_column]);
                            break;
                        case "datetime":
                            var first = Date.parse(a[sort_column]),
                                second = Date.parse(b[sort_column]);
                            result = first === second ? 0 : first - second > 0 ? 1 : -1;
                            break;
                        case "checkbox":
                            result = (a[sort_column] === b[sort_column])? 0 : a[sort_column]? -1 : 1;
                            break;
                        default:
                            result = a[sort_column].toString()
                                .localeCompare(b[sort_column].toString());
                            break;
                    }
                }
                return asc * result;
            });
        }
        return data;
    },
    // search box
    filter: function (data, search) {

        if (search !== undefined && search.indexOf(',') > -1) {
            search = {
                value : search.toUpperCase().replace(/ /g, '').split(','),
                'op' : 'in'
            };
        } else {
            search = {
                value: search,
                op: "startsWithCI"
            };
        }
        if (search != null && String(search) != "") {
            return data.filter(function (item) {
                return Object.keys(item).reduce(function (prev, field) {
                    var filtered = _module.filter_switch(item, field, search)
                    return prev || filtered;
                }, false);
            });
        }
        return data;
    },
    // filter for columns
    filter_columns: function (data, filters) {
        if (filters != null) {
            return data.filter(function (item) {
                return Object.keys(filters).reduce(function (prev, filter) {
                    return prev
                        && _module.filter_switch(item, filter, filters[filter]);
                }, true);
            });
        }
        return data;
    },
    filter_switch: function (item, filterId, filter) {
            // change simple filter to complex filter if needed
            if(Array.isArray(filter) || typeof filter !== "object") {
                if(Array.isArray(filter)) {
                    filter = filter.map(function(f) {
                        if(typeof f !== "object") {
                            return {
                                value: f
                            };
                        }
                        return f;
                    });
                } else {
                    filter = {
                        "value": filter
                    }
                }
            }

            if (compare[filter.op]) {
                return compare[filter.op](item[filterId], filter.value);
            }
            // operator not defined. perform default compare
            if (filter instanceof Array) {

                // see if value exists in array
                return filter.reduce(function (prev, filterObj, index) {
                    // if filter contains a comparison operator, initial value
                    // should be true, as the return will be 'and'ing the values
                    if (filterObj.op && compare[filterObj.op]) {
                        prev = index === 0 ? true : prev;
                        return prev && compare[filterObj.op](item[filterId], filterObj.value)
                    }
                    var result =  prev || filterObj.value.indexOf(item[filterId]) === 0 ;
                    return result;
                }, false);
            }

            return String(item[filterId]).indexOf(filter.value) === 0;

    },
    search: function (data, options, callback) {

        var start = Number(options.start) || 0,
            search = options.search,
            filters = options.filters,
            orderby = options.orderby;

        if (utils.DEBUG) console.log('search options', JSON.stringify(options));

        for (var key in orderby) {
            _module.sort(data, orderby[key].type, key, orderby[key].dir);
        }

        if (search) {
            data = _module.filter(data, search);
        }
        if (filters) {
            data = _module.filter_columns(data, filters);
        }

        var count = Number(options.count);
        if (count === undefined || count < 0 || isNaN(count)) {
            count = data.length;
        }
        // if no resultskey is given use SearchResult
        var resultsKey = "SearchResult";
        if(options.resultsKey){
            resultsKey = options.resultsKey;
        }
        var results = {};
        results[resultsKey]  = data.slice(start, start + count);
        results.final =  start + count >= data.length;
        results.total = data.length;
        callback(null, results);
    }

}
