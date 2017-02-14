import { Options, Sport, Fixture, Bookmaker, OptionsPost, setPrice} from '../../jmonitor-interface';
import { Observable} from 'rxjs/Rx';
var myAppConfig = require('./conf.json');
//configure i_log with module name 
var mylog = require('i-log')('Better');

export interface headerInfo {
	cookies : string, 
    token : string
}
export 	function getUriByLagueId(id:number){
	return {
		uri:myAppConfig.optionsLeague.uri.replace("#leagueId#",id),
		headers: myAppConfig.optionsLeague.headers}
	}

export 	function parseOdd (event:any):Fixture {
		
		var better:Bookmaker ={
				id: myAppConfig.jmonitor_bookmaker_id, 
				name: myAppConfig.name};
		var bookmakers:Bookmaker[] = [better];

		var betradarId: number = event.externalServiceReferences.
									filter(f => f.providerId== "BETRADAR").
									map(m=> m.externalId.replace("BR_",""))[0];

		var eventName: string = event.name;
		var startDate: Date = new Date(event.startTime);
		var f = new Fixture(better,betradarId,eventName,bookmakers,startDate,event.competitionName,event.competitionId);
		//each event contains 1x2 and handicap, for the moment we get just 1X2
		var market = event.eventMarketGroups.
					map (r=> r.detailedMarkets);
		var merged = [].concat.apply([], market).		
					filter(f=> f.marketTypeId=="FBL0N03WNSCFT")[0].selections;
		var selections = merged.map(r => {return {'name': r.name, 'price': r.priceValues.filter(f => f.formatId=="DECIMAL")[0].formatValue}})
		f.competitors[0].market1X2.signs = selections;
		
		return f;
	}


