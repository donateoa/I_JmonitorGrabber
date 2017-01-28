/// <reference path="../typings/globals/mocha/index.d.ts" />

import {Bookmaker, Grabber, Fixture, Options, OptionsPost} from '../jmonitor-interface'

var myAppConfig = require('../jgrabber.json');
var chai = require('chai')
  , chaiHttp = require('chai-http');

chai.use(chaiHttp);
var expect = chai.expect;

describe('mandotary parameter check ', function() {
var grabber = new Grabber();

    it('check uri for jmonitor', function createFixture() {
            expect(
                    new Options(myAppConfig.sbobet_program_uri)
                ).to.have.property('uri');
    });

});