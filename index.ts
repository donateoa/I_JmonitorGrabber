import {runSbobet} from './src/sbobet/Impl'
import {runBetter} from './src/better/Impl'
var grabber: string = "sbobet"

process.argv.forEach(function (val, index, array) {
    if (val.indexOf("sbobet")>=0) grabber = "sbobet";
    else if (val.indexOf("better")>=0) grabber = "better";
    else if (val.indexOf("intralot")>=0) grabber = "intralot";
    else if (val.indexOf("matchpoint")>=0) grabber = "matchpoint";
    else if (val.indexOf("snai")>=0) grabber = "snai";
    else if (val.indexOf("williamhill")>=0) grabber = "williamhill";
});

switch (grabber) {
    case "sbobet":
        runSbobet()
        break;
    case "better":
        runBetter()
        break;

    default:
        break;
}