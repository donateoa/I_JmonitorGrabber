/// <reference path="../typings/globals/mocha/index.d.ts" />

import {Bookmaker, Grabber, Fixture, Options, OptionsPost} from '../jmonitor-interface'

var myAppConfig = require('../jgrabber.json');
var chai = require('chai')
  , chaiHttp = require('chai-http');

chai.use(chaiHttp);
var expect = chai.expect;

describe('mandotary parameters check:', function() {

    it('jmonitor_post_data_uri', function createFixture() {
        expect(
            new Options(myAppConfig.jmonitor_post_data_uri)
        ).to.have.property('uri');
    });
    it('sbobet_odds_uri', function createFixture() {
        expect(
            new Options(myAppConfig.sbobet_odds_uri)
        ).to.have.property('uri');
    });
    it('sbobet_program_uri', function createFixture() {
        expect(
            new Options(myAppConfig.sbobet_program_uri)
        ).to.have.property('uri');
    });   
 it('elegible_sports', function createFixture() {
        expect(myAppConfig.elegible_sports).to.have.length.above(1);
    }); 
    
});