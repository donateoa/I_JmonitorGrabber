
import {Grabber, IOptions} from './classes';
var myAppConfig = require('./jmonitor.json');

//configure i_log with module name 
const implName ="sbobet"
var i_log = require('i-log')('impl-' +implName);

var grabber = new Grabber(myAppConfig.jmonitorOptions);
