import { Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/range';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/combineLatest'
import 'rxjs/add/operator/merge'
import 'rxjs/add/observable/of'
var i_log = require('i-log')('sbobet');


var myAppConfig = require('./conf.json');
var Promise = require("request-promise");
import {parseToken, getDateByIndex, headerInfo, parseUrl} from './utility'

export function runSbobet(){
    i_log.info("Start sbobet implementation")
/*
In order to get the price from sbobet we have to loop for i=0 to 7 and prepare the uri:
https://www.sbobet.com/euro/football/-> i=0 today no date spec
https://www.sbobet.com/euro/football/2017-02-2 -> day+1
....
https://www.sbobet.com/euro/football/more -> i=7

create a stream that emit each 10 secs. [null, day+1, day+2, day+3, day+4, day+5, day+6, more];
- - - [null] - - - - - [day+1] - - - - - [day+2] - - - - - ['more'] - - > each 10 minutes
*/
var timer = Observable.
    interval(20*1000).
    map (i => 'http://www.sbobet.com/euro/football/' +  getDateByIndex(i));

/*
Make a promise with calculated url and parse the response
Options:    - - -O - O1 - O2 - O3 - O4 - O5 - O6 - O7
Request:    - - -R - R1 - R2 - R3 - R4 - R5 - R6 - R7
*/
var requestStream = timer.
    flatMap(options => Promise(options)).
    map (r => parseUrl(r));

/*at the end Post calculated data to monitor*/
requestStream.
subscribe(r =>  Promise({
            uri: myAppConfig.jmonitor_post_data_uri,
            method: 'POST',
            json: true,
            body: r},
            () => i_log.info("Sent data to monitor (respose.ok) fixtures: ", r.length)),
            error => console.error(error),
            () => console.log('done'));
}
