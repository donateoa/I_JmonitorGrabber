//configure i_log with module name 
var i_log = require('i-log')('Index');
//get configuration data
var myAppConfig = require('./jgrabber.json');
//start output
i_log.info('booting ', myAppConfig.name);
import {Bookmaker, Grabber, Fixture} from './jmonitor-interface'

//do put
var grabber = new Grabber(myAppConfig.jmonitoOptions);
var bookmaker:Bookmaker = myAppConfig.bookmaker;
var betradarId=1;
var bookmakers:Bookmaker[] = [];
bookmakers.push(bookmaker);
var fixture = new Fixture(bookmaker,betradarId,"Evento A", bookmakers,new Date());
grabber.doPut(myAppConfig.jmonitorOptions, fixture, (err, data)=>{
    i_log.debug("", data)
})
