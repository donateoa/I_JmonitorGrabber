//configure i_log with module name 
var i_log = require('i-log')('jmonitor-interface');
var rp = require('request-promise');
export class Options{
    uri: string;
    constructor(uri: string) {
        if (uri == null) {
            throw "uri parameter is required"
        } else {
            this.uri = uri
        }
    };
}
export class OptionsPost extends Options{
    method: string = 'POST';
    json: boolean = true; // Automatically stringifies the body to JSON 
    body: any;
    constructor(uri:string) {
        super(uri);
    }
}


export class Grabber {
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
            rp(options)
                .then(function (htmlString) {
                    i_log.debug("programHandler htmlString:", htmlString); 
                    cb(null, htmlString);
                })
                .catch(function (err) {
                    // Crawling failed... 
                    console.log(err);
                    cb('Error. Call to ' + options.uri + ' failed');
                });
    }
}

export interface Bookmaker{
    id: number;
    name: string;
}

export class Sign {
    name: string;
    protected price: number;
    oldPrice: number;
    changed: boolean = false;

    constructor(name:string){ this.name = name;}
    
    setPrice = (x:number): boolean =>{
        if(this.oldPrice!=this.price) this.changed = true;
        else this.changed = false;
        this.oldPrice = this.price;
        this.price = x;
        return this.changed;
    }
    
    getPrice = ()=> this.price;
}

export class Market {
    signs: Sign[];
    constructor(public name:string){}
}

export class Market1X2 extends Market {
    constructor(){
        super('1X2');
        this.signs = [ new Sign("1"), new Sign("X"), new Sign("2")];
    }
    update = (signs: Sign[]): boolean => {
        let changed = false;
        for (var index in signs){
            if (this.signs[index].name == signs[index].name)
                changed = changed || this.signs[index].setPrice(signs[index].getPrice())
            else throw ("Position of signs in the input array must be in the following format [1,X,2] ");
        }
        return changed;
    }
}

export class Competitior {
    market1X2: Market1X2;
    constructor(public bookmakerId: number , public name: string){
        this.market1X2 = new Market1X2();
    }
}

export class Fixture {
    id: number;
    betradarId: number;
    name: string;
    date: Date;
    league: string;
    leagueId: number;
    country: string;
    contryCode: string; 
    competitiors: Competitior[] =[];

    constructor(book:Bookmaker, betradarId:number, name:string, bookmakers: Bookmaker[], date: Date, league?:string, leagueId?:number){
        if (typeof league !== "undefined") this.league = league;
         if (typeof leagueId !== "undefined") this.leagueId = leagueId;
         
        this.betradarId = betradarId;
        this.name = name;
        this.date = date;
        for (var b of bookmakers){
            this.competitiors.push (new Competitior(b.id, b.name));
        }
    }
   
}

export class Fixtures {
    private static instance: Fixtures;
    private map:{[id: number]: Fixture;} = {}; 
    private constructor() {
        this.map ={};
    }
    static getInstance() {
        if (!Fixtures.instance) {
            Fixtures.instance = new Fixtures();
        }
        return Fixtures.instance;
    }
}