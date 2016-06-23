var chai = require('chai'),
  path = require('path'),
  fs = require('fs'),
  utils = require(path.join(__dirname, '../index.js')),
  expect = chai.expect;

describe('Existence tests', function () {
  it('should be an object', function () {
    expect(utils).to.be.an('object');
  });
  it('should have fsWrapper', function () {
    expect(utils).to.have.property('fsWrapper');
    expect(utils.fsWrapper).to.be.an('object');
    expect(utils.fsWrapper).to.have.property('jsonToFile');
    expect(utils.fsWrapper.jsonToFile).to.be.a('function');
  });
  it('should have logger', function () {
    expect(utils).to.have.property('logger');
    expect(utils.logger).to.be.an('object');
  });
  it('should have sortAndFilter', function () {
    expect(utils).to.have.property('sortAndFilter');
    expect(utils.sortAndFilter).to.be.an('object');
  });
  it('should have dataUtils', function () {
    expect(utils).to.have.property('dataUtils');
    expect(utils.dataUtils).to.be.an('object');
  });
  it('should have setCacheHeaders', function () {
    expect(utils).to.have.property('setCacheHeaders');
    expect(utils.setCacheHeaders).to.be.an('object');
  });
});
