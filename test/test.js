"use strict";
var myAppConfig = require('../I_Jmonitor.json');
var expect = require('chai').expect;
describe('Configuration Check', function () {
    it('jmonitorOptions must be an IOption object ', function createFixture() {
        expect(myAppConfig.jmonitorOptions).to.be.a('object');
        expect(myAppConfig).to.have.property('jmonitorOptions');
    });
});
