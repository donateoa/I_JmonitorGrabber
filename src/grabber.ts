//configure i_log with module name 
var i_log = require('i-log')('grabber');
var rp = require('request-promise');
import { Options, Sport, Fixture, Bookmaker, OptionsPost, setPrice} from '../jmonitor-interface';
export class Grabber {
    bookId:number;
	bookName:string;
	cookies: string[] =[];
    constructor(bookId,bookName){
		if (bookId == null) throw ("book id is null or undefined")
		else{
			this.bookId = bookId;
			this.bookName = bookName;
		}
	}
    start () : void {
        console.log("start");
    }

    httpJqueryPage =()=>{
        /*TODO: require further study to understand if is possible crawl a page and use JQuery 
        Example from npm https://www.npmjs.com/package/request-promise.

       var cheerio = require('cheerio'); // Basically jQuery for node.js 
 
        var options = {
            uri: 'http://www.google.com',
            transform: function (body) {
                return cheerio.load(body);
            }
        };
        
        rp(options)
            .then(function ($) {
                // Process html like you would with jQuery... 
            })
            .catch(function (err) {
                // Crawling failed or Cheerio choked... 
            });
            */
    }

    httpCall = (options: Options, cb) => {
        i_log.debug("try http call with options:", options);
         return   rp(options)
                .then(function (response) {
                    cb(null, response);
                })
                .catch(function (err) {
                    // Crawling failed... 
                    console.log(err);
                    cb('Error. Call to ' + options.uri + ' failed');
                });
    }
    httpCallWithCookie = (options: Options, cookie:String[], cb) => {
        i_log.debug("try http call with cookie with cookie:", cookie);
        rp.jar().set
            rp(options)
                .then(function (response) {
                    cb(null, response);
                })
                .catch(function (err) {
                    // Crawling failed... 
                    console.log(err);
                    cb('Error. Call to ' + options.uri + ' failed');
                });
    }
}
