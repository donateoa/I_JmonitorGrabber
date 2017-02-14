import { Observable} from 'rxjs/Rx';
import 'rxjs/add/observable/range';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/combineLatest'
import 'rxjs/add/operator/merge'
import 'rxjs/add/observable/of'


var myAppConfig = require('./conf.json');
var Promise = require("request-promise");
import {parseToken, getDateByIndex, headerInfo, parseUrl} from './utility'

export function run(){
/*
In order to get the price from sbobet we have to set the header of each request with
- cookie
and the url must be done using
- token

Intent:
- create strem1 with observable<cookie, token,sessionId> that emit value each 10 minutes, 
  that means a token refresh each 10 minutes

- - - [C,T,S] - - - - - [C,T,S] - - - - - [C,T,S] - - - - - [C,T,S] - - > each 10 minutes
*/

var stream1 = Observable.
    interval(10*60*1000).
    flatMap(i => Promise({uri: myAppConfig.sbobet_program_uri})).
    map (r => {return {
        'cookies' : r['headers']['set-cookie'], 
        'token' : parseToken(r['body'])
    }});
  

/*
We can't send to much request at time else website will bann our IP so sending 1 request on 10 secs could be nice.
create a stream2 with observable<T> that emit value each 10 secs
- - 0 - - 1 - - 2 - - 3 - - 4 - - 5 - - 6 - - 7
transform in today + i%8
- - T - - T1 - - T2 - - T3 - - T4 - - T5 - - T6 - - T7
*/

var stream2 = Observable.
    interval(10*1000).
    map (i => getDateByIndex(i));

/*
Intent:
make the url 
url = "https://www.sbobet.com/en/data/event?ts=" + stream1.onNext.token + "&tk=1000000000,0,12,1,0,0,0," + stream2.onNext +",1,0,0,4";)

this is the output of two streams
- - - [C,T,S] - - - - - [C,T,S] - - - - - [C,T,S] - - - - - [C,T,S] - - 
- - T - - T1 - - T2 - - T3 - - T4 - - T5 - - T6 - - T7

and we would have 'combineLatest(f)': becouse we can use latest stream1.token for each stream2.
 - -[C,T,S],T - - [C,T,S],T1 - - [C,T,S],T2 - - [C,T,S],T3 - - [C,T,S],T4 - - [C,T,S],T5-->
token will be refreshed each 10 minutes.
 - - -U - U1 - U2 - U3 - U4 - U5 - U6 - U7
*/

var urlStream = stream1
  .combineLatest(stream2,             
    function(h:headerInfo, t:string) {
      return {
            uri: "https://www.sbobet.com/en/data/event?ts=" + h.token
				+ "&tk=1000000000,0,12,1,0,0,0," + t +",1,0,0,4",
            headers : {cookie:  h.cookies}   
        }
    }
  )
/*
Intent:
make a promise with url and parse the response
Url:        - - -U - U1 - U2 - U3 - U4 - U5 - U6 - U7
Request:    - - -R - R1 - R2 - R3 - R4 - R5 - R6 - R7
*/
var requestStream = urlStream.
    flatMap(options => Promise(options)).
    map (r => parseUrl(r));

/*Post data to monitor*/
requestStream.
subscribe(r =>  Promise({
                uri: myAppConfig.jmonitor_post_data_uri,
                action: 'POST',
                body: JSON.stringify(r)})
               ,
           error => console.error(error),
           () => console.log('done'));

}
