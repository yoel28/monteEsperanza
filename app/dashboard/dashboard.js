"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var router_deprecated_1 = require('@angular/router-deprecated');
var http_1 = require('@angular/http');
var http_utils_1 = require("../common/http-utils");
var ng2_highcharts_1 = require('ng2-highcharts/ng2-highcharts');
var Dashboard = (function () {
    function Dashboard(router, http) {
        this.router = router;
        this.dataCamion = [];
        this.dataArea = {
            chart: {
                type: 'area',
            },
            xAxis: {
                categories: [],
            },
            yAxis: {
                title: {
                    text: "Cantidad",
                },
            },
            credits: {
                enabled: false
            },
            series: [],
            title: { text: 'Uso del vertedero' },
        };
        this.error = function (err) {
            console.log(err);
        };
        this.dataPlot = [];
        if (!localStorage.getItem('bearer')) {
            var link = ['AccountLogin', {}];
            router.navigate(link);
        }
        this.endpoint = "/users/";
        this.httputils = new http_utils_1.HttpUtils(http);
        this.getPlot1();
        this.getPlot2();
    }
    Dashboard.prototype.goTaquilla = function () {
        var link = ['Taquilla', {}];
        this.router.navigate(link);
    };
    Dashboard.prototype.getPlot1 = function () {
        var _this = this;
        var successCallback = function (response) {
            Object.assign(_this.dataArea.series, response.json().series);
            if (response.json().categories)
                Object.assign(_this.dataArea.xAxis.categories, response.json().categories);
        };
        this.httputils.doGet("/dashboards/plot/1/2016", successCallback, this.error);
    };
    Dashboard.prototype.getPlot2 = function () {
        var _this = this;
        var successCallback = function (response) {
            Object.assign(_this.dataPlot, response.json());
            _this.dataPlot.total = 0;
            _this.dataPlot.forEach(function (val) {
                if (val.quantity > 0)
                    _this.dataPlot.total += val.quantity;
                else
                    val.quantity *= -1;
            });
        };
        this.httputils.doGet("/dashboards/plot/2/2016", successCallback, this.error);
    };
    Dashboard = __decorate([
        core_1.Component({
            selector: 'home',
            templateUrl: 'app/dashboard/dashboard.html',
            styleUrls: ['app/dashboard/dashboard.css'],
            directives: [ng2_highcharts_1.Ng2Highcharts],
        }), 
        __metadata('design:paramtypes', [router_deprecated_1.Router, http_1.Http])
    ], Dashboard);
    return Dashboard;
}());
exports.Dashboard = Dashboard;
//# sourceMappingURL=dashboard.js.map