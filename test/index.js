const chai = require('chai');
const paths = require('app-module-path');

global.expect = chai.expect;

paths.addPath(__dirname + '/../');
