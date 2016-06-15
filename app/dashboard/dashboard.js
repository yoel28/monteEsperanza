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
var Dashboard = (function () {
    function Dashboard(router, http) {
        this.dataCamion = [];
        this.error = function (err) {
            console.log(err);
        };
        if (!localStorage.getItem('bearer')) {
            var link = ['AccountLogin', {}];
            router.navigate(link);
        }
        this.endpoint = "/users/";
        this.httputils = new http_utils_1.HttpUtils(http);
    }
    Dashboard = __decorate([
        core_1.Component({
            selector: 'home',
            templateUrl: 'app/dashboard/dashboard.html',
            styleUrls: ['app/dashboard/dashboard.css']
        }), 
        __metadata('design:paramtypes', [router_deprecated_1.Router, http_1.Http])
    ], Dashboard);
    return Dashboard;
}());
exports.Dashboard = Dashboard;
//# sourceMappingURL=dashboard.js.map