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
var common_1 = require('@angular/common');
var http_utils_1 = require("../common/http-utils");
var Regla = (function () {
    function Regla(router, http, _formBuilder) {
        this.router = router;
        this.http = http;
        this.dataList = [];
        this.error = function (err) {
            console.log(err);
        };
        if (!localStorage.getItem('bearer')) {
            var link = ['AccountLogin', {}];
            this.router.navigate(link);
        }
        this.endpoint = "/rules/";
        this.httputils = new http_utils_1.HttpUtils(http);
        this.loadData();
        this.rule = new common_1.Control("", common_1.Validators.compose([common_1.Validators.required]));
        this.name = new common_1.Control("", common_1.Validators.compose([common_1.Validators.required]));
        this.form = _formBuilder.group({
            rule: this.rule,
            name: this.name,
        });
    }
    Regla.prototype.loadData = function () {
        event.preventDefault();
        this.httputils.onLoadList(this.endpoint, this.dataList, this.error);
    };
    Regla.prototype.onUpdate = function (event, data) {
        if (data[event.target.accessKey] != event.target.innerHTML) {
            data[event.target.accessKey] = event.target.innerHTML;
            var body = JSON.stringify(data);
            this.httputils.onUpdate(this.endpoint + data.id, body, this.dataList, this.error);
        }
    };
    Regla.prototype.onDelete = function (event, id) {
        event.preventDefault();
        this.httputils.onDelete(this.endpoint + id, id, this.dataList, this.error);
    };
    Regla.prototype.onSave = function (event) {
        event.preventDefault();
        var body = JSON.stringify(this.form.value);
        this.httputils.onSave(this.endpoint, body, this.dataList, this.error);
    };
    Regla = __decorate([
        core_1.Component({
            selector: 'regla',
            templateUrl: 'app/regla/regla.html',
            styleUrls: ['app/regla/regla.css']
        }), 
        __metadata('design:paramtypes', [router_deprecated_1.Router, http_1.Http, common_1.FormBuilder])
    ], Regla);
    return Regla;
}());
exports.Regla = Regla;
//# sourceMappingURL=regla.js.map