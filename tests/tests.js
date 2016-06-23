var chai = require('chai'),
  path = require('path'),
  utils = require(path.join(__dirname, '../index.js')),
  expect = chai.expect;

describe('All tests', function () {
  it('should be an object', function () {
    expect(utils).to.be.an('object');
  });
  it('should have fsWrapper', function () {
    expect(utils).to.have.property('fsWrapper');
    expect(utils.fsWrapper).to.be.an('object');
  });
  it('should have logger', function () {
    expect(utils).to.have.property('logger');
    expect(utils.logger).to.be.an('object');
  });
});
