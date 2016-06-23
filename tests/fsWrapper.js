var chai = require('chai'),
  path = require('path'),
  fs = require('fs'),
  utils = require(path.join(__dirname, '../index.js')),
  expect = chai.expect;

describe('fsWrapper tests', function () {
  let testFile = 'test.json';
  afterEach(function () {
    //delete file after running tests
    fs.unlinkSync(testFile);
  });
  it('should create and read a json file synchronously', function () {
    let testData = {'testKey': 'testVal'};
    //file should not exist
    try {
      fs.lstatSync(testFile);
    } catch (ex) {
      expect(ex).to.not.be.a('null');
    }
    utils.fsWrapper.jsonToFileSync(testFile, testData);
    //file should exist
    expect(fs.lstatSync(testFile)).to.be.an('object');
    let res = utils.fsWrapper.fileToJsonSync(testFile);
    expect(res).to.deep.equal(testData);
  });
  it('should create and read a json file asynchronously', function (done) {
    let testData = {'testKey': 'testVal'};
    //file should not exist
    try {
      fs.lstatSync(testFile);
    } catch (ex) {
      expect(ex).to.not.be.a('null');
    }
    utils.fsWrapper.jsonToFile(testFile, testData, function(err, data) {
      //file should exist
      expect(fs.lstatSync(testFile)).to.be.an('object');
      expect(err).to.be.an('null');
      utils.fsWrapper.fileToJson(testFile, function(err, res) {
        expect(res).to.deep.equal(testData);
        done();
      });
    });
  });
});
