"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
//configure i_log with module name 
var i_log = require('i-log')('jmonitor-interface');
var rp = require('request-promise');
var Options = (function () {
    function Options(uri) {
        if (uri == null) {
            throw "uri parameter is required";
        }
        else {
            this.uri = uri;
        }
    }
    ;
    return Options;
}());
exports.Options = Options;
var OptionsPost = (function (_super) {
    __extends(OptionsPost, _super);
    function OptionsPost(uri) {
        var _this = _super.call(this, uri) || this;
        _this.method = 'POST';
        _this.json = true; // Automatically stringifies the body to JSON 
        return _this;
    }
    return OptionsPost;
}(Options));
exports.OptionsPost = OptionsPost;
var Grabber = (function () {
    function Grabber() {
        this.httpJqueryPage = function () {
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
        };
        this.httpCall = function (options, cb) {
            i_log.debug("try http call with options:", options);
            rp(options)
                .then(function (htmlString) {
                i_log.debug("programHandler:", htmlString);
                cb(htmlString);
            })["catch"](function (err) {
                // Crawling failed... 
                console.log(err);
                cb('Error. Call to ' + options.uri + ' failed');
            });
        };
    }
    return Grabber;
}());
exports.Grabber = Grabber;
var Sign = (function () {
    function Sign(name) {
        var _this = this;
        this.changed = false;
        this.setPrice = function (x) {
            if (_this.oldPrice != _this.price)
                _this.changed = true;
            else
                _this.changed = false;
            _this.oldPrice = _this.price;
            _this.price = x;
            return _this.changed;
        };
        this.getPrice = function () { return _this.price; };
        this.name = name;
    }
    return Sign;
}());
exports.Sign = Sign;
var Market = (function () {
    function Market(name) {
        this.name = name;
    }
    return Market;
}());
exports.Market = Market;
var Market1X2 = (function (_super) {
    __extends(Market1X2, _super);
    function Market1X2() {
        var _this = _super.call(this, '1X2') || this;
        _this.update = function (signs) {
            var changed = false;
            for (var index in signs) {
                if (_this.signs[index].name == signs[index].name)
                    changed = changed || _this.signs[index].setPrice(signs[index].getPrice());
                else
                    throw ("Position of signs in the input array must be in the following format [1,X,2] ");
            }
            return changed;
        };
        _this.signs = [new Sign("1"), new Sign("X"), new Sign("2")];
        return _this;
    }
    return Market1X2;
}(Market));
exports.Market1X2 = Market1X2;
var Competitior = (function () {
    function Competitior(bookmakerId, name) {
        this.bookmakerId = bookmakerId;
        this.name = name;
        this.market1X2 = new Market1X2();
    }
    return Competitior;
}());
exports.Competitior = Competitior;
var Fixture = (function () {
    function Fixture(book, betradarId, name, bookmakers, date, league, leagueId) {
        this.competitiors = [];
        if (typeof league !== "undefined")
            this.league = league;
        if (typeof leagueId !== "undefined")
            this.leagueId = leagueId;
        this.betradarId = betradarId;
        this.name = name;
        this.date = date;
        for (var _i = 0, bookmakers_1 = bookmakers; _i < bookmakers_1.length; _i++) {
            var b = bookmakers_1[_i];
            this.competitiors.push(new Competitior(b.id, b.name));
        }
    }
    return Fixture;
}());
exports.Fixture = Fixture;
var Fixtures = (function () {
    function Fixtures() {
        this.map = {};
        this.map = {};
    }
    Fixtures.getInstance = function () {
        if (!Fixtures.instance) {
            Fixtures.instance = new Fixtures();
        }
        return Fixtures.instance;
    };
    return Fixtures;
}());
exports.Fixtures = Fixtures;
