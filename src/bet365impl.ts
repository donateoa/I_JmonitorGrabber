
import {Grabber, IOptions} from '../jmonitor-interface';
var myAppConfig = require('../jgrabber.json');

//configure i_log with module name 
const implName ="sbobet"
var i_log = require('i-log')('impl-' +implName);

export namespace  Program{
     function parseRow (item){
        var ret={};
        //make map from input data
        var a = item.split(";");
        for (var j=0;j<a.length;j++) {
            var b = a[j].split("=");
            if(b[0] && b[1]) ret[b[0]]=b[1];
        }
        return ret;
    }

     function  parse (stringData , callback){
        var program=[], league = "";	
        var row = stringData.split("|")
        
        //create an array with the keys which must be concatenate to the URL_ODDS.
        for ( var i = 0; i < row.length; i++ ){
            var item = parseRow(row[i]);
            if(item["PD"]) program.push(item["PD"]);
        }
        callback (null, program)
    }
     export function handler(err, data) {
        if (err) i_log.error("unhandled error: ", err);
        else parse(data, function (err, parsedObject) {
            if (err) i_log.error("unhandled error: ", err);
            else {
                //Store parsed object for 

                i_log.info("Exit programHandler");
                i_log.debug("Program: ", parsedObject);

                var logMessage = ["",
                    "Attention: Program is empty.",
                    "Some troubles with http endpoint occurs.",
                    "Check that your config.URL_PROGRAM is propertly set or",
                    "verify the url:" + myAppConfig.programOptions.host + myAppConfig.programOptions.path + " is currently reacheable from browser."
                ];

                if (parsedObject.length === 0) i_log.error("", logMessage);
            }
        });
    };	
}
