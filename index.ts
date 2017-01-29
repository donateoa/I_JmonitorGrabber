var rp = require('request-promise');
//configure i_log with module name 
var i_log = require('i-log')('Index');
//get configuration data
var myAppConfig = require('./jgrabber.json');
//start output
i_log.info('booting ', myAppConfig.name);
import {Bookmaker, Grabber, Fixture, Options, OptionsPost} from './jmonitor-interface'
import {SbobetImpl} from './src/sbobetImpl'

//do put
var grabber = new Grabber();
var bookmaker:Bookmaker = {id: myAppConfig.jmonitor_bookmaker_id, name:myAppConfig.name};
var betradarId=1;
var bookmakers:Bookmaker[] = [];
bookmakers.push(bookmaker);
var fixture = new Fixture(bookmaker,betradarId,"Evento A", bookmakers,new Date());

var sbobet:SbobetImpl = new SbobetImpl(0, "sbobet");
//get the program from sbobet and parse the response
i_log.debug("get the program at " + myAppConfig.sbobet_program_uri);
rp(new Options(myAppConfig.sbobet_program_uri))
    .then(function programHandler(response){
        sbobet.cookies = response.headers["set-cookie"];
        sbobet.setProgram(response.body);
          //loop on the days. start with index 0;
        sbobet.runOnDays(0);
    });


/*
if(myAppConfig.jmonitor_post_data_uri ==null) {
    console.log("Configuration key jmonitor_post_data_uri is undefined or null in jgrabber.json")
} else {
    grabber.httpCall(
        new OptionsPost(myAppConfig.jmonitor_post_data_uri), 
        SbobetImpl.handlerProgram
        );
}
*/






