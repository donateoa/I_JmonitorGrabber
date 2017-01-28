/// <reference path="../typings/globals/mocha/index.d.ts" />
"use strict";
var jmonitor_interface_1 = require("../jmonitor-interface");
var myAppConfig = require('../jgrabber.json');
var chai = require('chai'), chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = chai.expect;
describe('mandotary parameter check ', function () {
    var grabber = new jmonitor_interface_1.Grabber();
    it('check uri for jmonitor', function createFixture() {
        expect(new jmonitor_interface_1.Options(myAppConfig.sbobet_program_uri)).to.have.property('uri');
    });
});
