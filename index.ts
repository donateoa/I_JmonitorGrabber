import {runSbobet} from './src/sbobet/Impl'
import {runBetter} from './src/better/Impl'
import {runMatchpoint} from './src/matchpoint/Impl'
var grabber: string;

process.argv.forEach(function (val, index, array) {
    if (val.indexOf("sbobet")>=0) runSbobet();
    else if (val.indexOf("better")>=0) runBetter();
    else if (val.indexOf("intralot")>=0) grabber = "intralot";
    else if (val.indexOf("matchpoint")>=0) runMatchpoint();
    else if (val.indexOf("snai")>=0) grabber = "snai";
    else if (val.indexOf("williamhill")>=0) grabber = "williamhill";
    //else throw ('Parameter bookmaker missing. Write the name of bookmaker after npm start.')
});
