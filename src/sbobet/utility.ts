import { Options, Sport, Fixture, Bookmaker, OptionsPost, setPrice} from '../../jmonitor-interface';
var myAppConfig = require('./conf.json');
//configure i_log with module name 
var mylog = require('i-log')('Sbobet');

export interface headerInfo {
	cookies : string, 
    token : string
}
export 	function getUriByIndex(index:number, token){
		 return  "https://www.sbobet.com/en/data/event?ts=" + token
				+ "&tk=1000000000,0,12,1,0,0,0," + getDateByIndex(index) +",1,0,0,4";
	}

export 	function parseOdd (list:any[]):Fixture[] {
		if(list.length<=2) return;
		if(list[2].length<=0) return;
		if(typeof list[2][0] == 'string') return;
		if(typeof list[2][0] == 'array' &&  list[2][0].length <=1 ) return;
		if(typeof list[2][0][1] == 'array' &&  list[2][0][1].length <=1 ) return;
		
		var sbobet:Bookmaker ={
				id: myAppConfig.jmonitor_bookmaker_id, 
				name: myAppConfig.name};

		var bookmakers:Bookmaker[] = [sbobet];
		var rows:any[] = list[2][0][1];
		var fixtures:Fixture[] = [];
		if(list[2].length>1) rows = list[2][1][1];
		for (var i=0; i< rows.length;i++){
			var betradarId: number = rows[i][2][0];
			var eventName: string = rows[i][2][1] + " - " + rows[i][2][2];
			var startDate: Date = rows[i][2][5];
			if (!rows[i][4] || !rows[i][4][2]) continue;
			var price:any[] =rows[i][4][2][2]
			console.log(price);
			var f = new Fixture(sbobet,betradarId,eventName,bookmakers,startDate);
			for (var ii=0;ii<price.length;ii++){
				setPrice(f.competitors[0].market1X2.signs[ii],price[ii]);
			}
			fixtures.push(f);
			//each event contains 1x2 and handicap, for the moment we get just 1X2
			mylog.debug(f);
		}
		return fixtures;
	}
export function parseUrl(data) {
	return parseOdd(splitData(data));
}


export function splitData (stringData:String):any[]{
        /* Follow is a sample of output for sbobet response
				[5753,1,[[2,[[1,137,[1366145,'Nova Iguacu','Cabofriense','1.G43Q',1,'01/24/2014 03:00','',0,0,1,,{}],,[[8,8,[]],[20013017,[5,0,5,0,500,0.00,489422],[2.34,3.20,2.95]],[20013020,[8,0,8,0,500,0.00,489422],[2.85,2.00,3.70]]],1],[1,137,[1366144,'Fluminense','Bonsucesso FC','1.G43P',1,'01/24/2014 05:30','',0,0,1,,{}],,[[8,8,[]],[20013004,[5,0,5,0,500,0.00,489421],[1.35,4.60,8.50]],[20013007,[8,0,8,0,500,0.00,489421],[1.61,2.75,7.40]]],1],[1,138,[1366120,'Comercial RP','Palmeiras','1.G42T',1,'01/24/2014 07:00','',0,0,0,,{}],,[[8,8,[]],[20012508,[5,0,5,0,1000,0.00,489397],[4.80,3.90,1.63]],[20012511,[8,0,8,0,500,0.00,489397],[4.70,2.19,2.22]]],2]],[],[]]];
			*/
			var start = stringData.indexOf("$P.onUpdate('od',");
			var end = stringData.indexOf(']);',start);
			var htmlString = stringData.substring(start+"$P.onUpdate('od',".length, end-1);
			var slen: number = htmlString.length;
            var list = [], currentList =[], parentList = null;
			var currentString = '';
            var parent: {[id: number]: any}={};
			var currentName: number=0;
			for (var i=0; i<slen; i++){
				var c: string = htmlString.charAt(i);
				if(c=='['){
					currentName++;
					if(parentList === null){
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
					while (htmlString.charAt(i)==']'){
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
			return list;
		}


export function getDateByIndex (index:number):string  {
		index = index%8;
		if(index==0) return '';
		else if(index==7) return 'more';
		else{
			var d:Date = new Date();
			d.setDate(d.getDate() + index);
			var srtingMonth = ("00" + (d.getMonth()+1));
			var srtingDay = ("00" + d.getDate());
			srtingMonth = srtingMonth.substring(srtingMonth.length-2);
			srtingDay = srtingDay.substring(srtingDay.length-2);
			var stringDate = d.getFullYear() +'-' +srtingMonth+'-'+srtingDay;
			return stringDate;
		}
	};


export var parseToken = (htmlString:string):string =>{

		var start = htmlString.indexOf('new tilib_Token([');
		start = htmlString.indexOf('],[',start);
		start = htmlString.indexOf(",'",start);//seek first comma
		start = htmlString.indexOf(",'",start+"',".length);//seek second comma
		var end =htmlString.indexOf("',",start);
		var token = htmlString.substring(start+"',".length, end);
		mylog.debug("get token:", token);
		//assume that if the length of token is right equal to the standard it is working
		if(token.length!='96445c4e'.length)
			throw ("token is not standard: " + token);
		else 
			return token; 
	}


