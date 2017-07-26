import { Observable} from 'rxjs/Rx';
import 'rxjs/add/observable/range';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/combineLatest'
import 'rxjs/add/operator/merge'
import 'rxjs/add/observable/of'
var i_log = require('i-log')('better');


var myAppConfig = require('./conf.json');
var Promise = require("request-promise");
import {getUriByLagueId,  parseOdd} from './utility'

export function runBetter(){
    i_log.info("start Better implementation")
/*
Intent:
- create strem1 with observable<programJSON> that emit value each 10 minutes, 
  that means a program refresh each 10 minutes
  apply filter returning only tag with sportId = Football

- - - league[] - - - - - league[] - - - - - league[] - - - - - league[] - - > each 10 minutes
*/

var stream1 = Observable.
    interval(1*1000).
    take(1).
    flatMap(i => Promise(myAppConfig.optionsProgram)).
    map (r => JSON.parse(r.toString())).
    filter (f => f.resultCode ==0 ).
    map(r => r.extNode.nodesNavigation).
    concatAll().
    filter (f => f.sportId =='FBL')
    .map (r => r.nodesNavigation).
    concatAll()
    .map (r => r.nodesNavigation).
    concatAll()
    .filter (f=>f.boGroup.childNodesNum>0); 

/*
Each sample of stram1 is an observable with a league[] array, we have to iterate on it and get price for each of them.
We can't send to much request at time else website will bann our IP so sending 1 request on 10 secs could be nice.

Intent:
create an delayedStream that emit each T one item of leagues[]
*/
var timer = Observable.interval(10000);
var delayedStream = stream1.
    zip(timer, s => s).
    flatMap(i =>Promise(getUriByLagueId(i.id))).
    map (r => JSON.parse(r.toString())).
    filter (f => f.events.boGroup.events.length > 0 ).
    flatMap(r => r.events.boGroup.events);

delayedStream.
    subscribe(r =>  {
         var fixture = parseOdd(r);
        Promise({
                uri: myAppConfig.jmonitor_post_data_uri,
                method: 'POST',
                json: true,
                body: fixture})

        i_log.debug(fixture);
       
       
    },
    error => console.error(error),
    () => i_log.info('get program done'));

}
