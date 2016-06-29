var chai = require('chai'),
  path = require('path'),
  _ = require('lodash'),
  fs = require('fs'),
  parseRole = require(path.join(__dirname, '../src/index.js')).parseRole,
  expect = chai.expect;

describe('parseRole tests', function () {
  let tree = {
      "type" : "globalNavigation",
      "routes": [
        {
           "text": "Dashboard",
           "route": "dashboard/{options*}",
           "get": "pjson?name=pages/dashboard",
           "roleid": [
              "admin"
           ]
        },
        {
           "text": "Help",
           "route": "help/{options*}",
           "get": "pjson?name=pages/help",
           "roleid": [
              "user"
           ]
        },
        {
           "text": "Blah",
           "route": "blah/{options*}",
           "get": "pjson?name=pages/blah",
           "roleid": [
              "user", "test"
           ]
        }
      ]
  };
  let treeWithoutRoles = {
      "type" : "globalNavigation",
      "routes": [
        {
           "text": "Dashboard",
           "route": "dashboard/{options*}",
           "get": "pjson?name=pages/dashboard"
        },
        {
           "text": "Help",
           "route": "help/{options*}",
           "get": "pjson?name=pages/help"
        },
        {
           "text": "Blah",
           "route": "blah/{options*}",
           "get": "pjson?name=pages/blah"
        }
      ]
  };
  it('should get a single branch', function () {
    let roles = ['admin'];
    let metadata = _.cloneDeep(tree);
    let filtered = parseRole.parse(metadata, roles);
    expect(filtered).to.deep.equal({
        "type" : "globalNavigation",
        "routes": [
          {
             "text": "Dashboard",
             "route": "dashboard/{options*}",
             "get": "pjson?name=pages/dashboard"
          }
        ]
    });
  });
  it('should get two branches', function () {
    let roles = ['user'];
    let metadata = _.cloneDeep(tree);
    let filtered = parseRole.parse(metadata, roles);
    expect(filtered).to.deep.equal({
        "type" : "globalNavigation",
        "routes": [
          {
             "text": "Help",
             "route": "help/{options*}",
             "get": "pjson?name=pages/help"
          },
          {
             "text": "Blah",
             "route": "blah/{options*}",
             "get": "pjson?name=pages/blah"
          }
        ]
    });
  });
  it('should get a branch with two roles', function () {
    let roles = ['test'];
    let metadata = _.cloneDeep(tree);
    let filtered = parseRole.parse(metadata, roles);
    expect(filtered).to.deep.equal({
        "type" : "globalNavigation",
        "routes": [
          {
             "text": "Blah",
             "route": "blah/{options*}",
             "get": "pjson?name=pages/blah"
          }
        ]
    });
  });
  it('should modify the input', function () {
    let roles = ['admin'];
    let metadata = _.cloneDeep(tree);
    let filtered = parseRole.parse(metadata, roles);
    //passed in data is modified
    expect(metadata).to.deep.equal(filtered);
    expect(metadata).to.not.deep.equal(tree);
  });
  it('should get everything if user has all roles', function () {
    let roles = ['admin', 'user'];
    let metadata = _.cloneDeep(tree);
    let filtered = parseRole.parse(metadata, roles);
    expect(filtered).to.deep.equal(treeWithoutRoles);
  });
  it('should get everything if user has all roles and more', function () {
    let roles = ['admin', 'user', 'random'];
    let metadata = _.cloneDeep(tree);
    let filtered = parseRole.parse(metadata, roles);
    expect(filtered).to.deep.equal(treeWithoutRoles);
  });
  it('should get nothing if roles is empty array', function () {
    let roles = [];
    let metadata = _.cloneDeep(tree);
    let filtered = parseRole.parse(metadata, roles);
    expect(filtered).to.deep.equal({
      "type": "globalNavigation"
    });
  });
  it('should get nothing if roles is one element empty string', function () {
    let roles = [''];
    let metadata = _.cloneDeep(tree);
    let filtered = parseRole.parse(metadata, roles);
    expect(filtered).to.deep.equal({
      "type": "globalNavigation"
    });
  });
});
