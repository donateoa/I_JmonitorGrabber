export class Sport{
    id:string; 
    name:string
    constructor(id:string, name:string){
        this.id = id;
        this.name = name;
    }
}
export class Options{
    uri: string;
    resolveWithFullResponse:boolean= true; //force request-promice to return the whole response instead the body
    headers:{cookie:string[]};

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


export interface Bookmaker{
    id: number;
    name: string;
}
export function setPrice (sign:Sign, x:number): boolean {
        if(sign.oldPrice!=sign.price) sign.changed = true;
        else sign.changed = false;
        sign.oldPrice = sign.price;
        sign.price = x;
        return sign.changed;
    }

export class Sign {
    name: string;
    price: number;
    oldPrice: number;
    changed: boolean = false;

    constructor(name:string){ this.name = name;}
    
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
    
}

export class Competitor {
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
    competitors: Competitor[] =[];

    constructor(book:Bookmaker, betradarId:number, name:string, bookmakers: Bookmaker[], date: Date, league?:string, leagueId?:number){
        if (typeof league !== "undefined") this.league = league;
         if (typeof leagueId !== "undefined") this.leagueId = leagueId;
         
        this.betradarId = betradarId;
        this.name = name;
        this.date = date;
        for (var b of bookmakers){
            this.competitors.push (new Competitor(b.id, b.name));
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