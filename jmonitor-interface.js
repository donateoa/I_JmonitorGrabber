"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Sport = (function () {
    function Sport(id, name) {
        this.id = id;
        this.name = name;
    }
    return Sport;
}());
exports.Sport = Sport;
var Options = (function () {
    function Options(uri) {
        this.resolveWithFullResponse = true; //force request-promice to return the whole response instead the body
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
function setPrice(sign, x) {
    if (sign.oldPrice != sign.price)
        sign.changed = true;
    else
        sign.changed = false;
    sign.oldPrice = sign.price;
    sign.price = x;
    return sign.changed;
}
exports.setPrice = setPrice;
var Sign = (function () {
    function Sign(name) {
        var _this = this;
        this.changed = false;
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
        _this.signs = [new Sign("1"), new Sign("X"), new Sign("2")];
        return _this;
    }
    return Market1X2;
}(Market));
exports.Market1X2 = Market1X2;
var Competitor = (function () {
    function Competitor(bookmakerId, name) {
        this.bookmakerId = bookmakerId;
        this.name = name;
        this.market1X2 = new Market1X2();
    }
    return Competitor;
}());
exports.Competitor = Competitor;
var Fixture = (function () {
    function Fixture(book, betradarId, name, bookmakers, date, league, leagueId) {
        this.competitors = [];
        if (typeof league !== "undefined")
            this.league = league;
        if (typeof leagueId !== "undefined")
            this.leagueId = leagueId;
        this.betradarId = betradarId;
        this.name = name;
        this.date = date;
        for (var _i = 0, bookmakers_1 = bookmakers; _i < bookmakers_1.length; _i++) {
            var b = bookmakers_1[_i];
            this.competitors.push(new Competitor(b.id, b.name));
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
