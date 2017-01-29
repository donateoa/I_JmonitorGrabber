
import {Grabber, Options} from '../jmonitor-interface';
var myAppConfig = require('../jgrabber.json');
//configure i_log with module name 
var mylog = require('i-log')('SbobetImpl');

export class  SbobetImpl{
	private dynamicjs: string;
	private token: string;
	constructor(){};
	setDynamicjs= (htmlString:string) =>{
		var start = htmlString.indexOf('euro-dynamic.js');
		var end =htmlString.indexOf('>',start);
		this.dynamicjs = htmlString.substring(start, end -'>'.length);
		mylog.debug("get dynamicjs:", this.dynamicjs); 
		//assume that if the length of token is right equal to the standard it is working
		if(this.dynamicjs.length!='euro-dynamic.js?2913a1a2'.length)
			throw ("dynamicjs is not standard: " + this.dynamicjs);
		else 	
			return this.dynamicjs;
	}
	getDynamicjs= () => {return this.dynamicjs}
	
	setToken = (htmlString:string) =>{

		var s: string = 'new tilib_Token([';
		var start = htmlString.indexOf('new tilib_Token([');
		start = htmlString.indexOf('],[',start);
		start = htmlString.indexOf(",'",start);//seek first comma
		start = htmlString.indexOf(",'",start+"',".length);//seek second comma
		var end =htmlString.indexOf("',",start);
		this.token = htmlString.substring(start+"',".length, end);
		mylog.debug("get token:", this.token);
		//assume that if the length of token is right equal to the standard it is working
		if(this.token.length!='96445c4e'.length)
			throw ("token is not standard: " + this.token);
		else 
			return this.token; 
	}
	getToken =()=>{return this.token};

    normalize = (response:String) =>{
        /* Follow is a sample of output for sbobet response
				[5753,1,[[2,[[1,137,[1366145,'Nova Iguacu','Cabofriense','1.G43Q',1,'01/24/2014 03:00','',0,0,1,,{}],,[[8,8,[]],[20013017,[5,0,5,0,500,0.00,489422],[2.34,3.20,2.95]],[20013020,[8,0,8,0,500,0.00,489422],[2.85,2.00,3.70]]],1],[1,137,[1366144,'Fluminense','Bonsucesso FC','1.G43P',1,'01/24/2014 05:30','',0,0,1,,{}],,[[8,8,[]],[20013004,[5,0,5,0,500,0.00,489421],[1.35,4.60,8.50]],[20013007,[8,0,8,0,500,0.00,489421],[1.61,2.75,7.40]]],1],[1,138,[1366120,'Comercial RP','Palmeiras','1.G42T',1,'01/24/2014 07:00','',0,0,0,,{}],,[[8,8,[]],[20012508,[5,0,5,0,1000,0.00,489397],[4.80,3.90,1.63]],[20012511,[8,0,8,0,500,0.00,489397],[4.70,2.19,2.22]]],2]],[],[]]];
			*/
			var slen: number = response.length;
            var list = [], currentList =[], parentList = [];
			var currentString = '';
            var parent: {[id: number]: any}={};
			var currentName: number=0;
			for (var i=0; i<slen; i++){
				var c: string = response.charAt(i);
				if(c=='['){
					currentName++;
					if(parentList==null){
						currentList = list;
						parentList = currentList;
                        parent[currentName] = parentList;
					} else {
                        parentList = currentList;
                        currentList = [];
                        parent[currentName] = parentList;
                        parentList.push(currentList);
                    }
				}else if(c==']'){
					currentList.push(currentString);
					currentString = '';
					while (response.charAt(i)==']'){
                        currentList = parent[currentName];
						i++;	
						if(i>=slen) break;
						currentName--;
					}
					
				} else if(c==',') {
					currentList.push(currentString);
					currentString = '';
				} else if(c!='\'') {
					currentString += c;
				}
			}
            mylog.info("return list", list);
			return list;
			
		}



	handlerProgram = (err, data) =>{
		if (err) {
			console.log(err)
		} else {
			var dinamicjs = this.setDynamicjs(data);
			var token = this.setToken(data);
			mylog.info("taken dinamicjs:" + dinamicjs +" token:"+ token);
			//getOdd(odds);
		}

	}

}
