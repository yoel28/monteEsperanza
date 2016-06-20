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
var common_1 = require('@angular/common');
var TipoEmpresaSave = (function () {
    function TipoEmpresaSave(_formBuilder) {
        this._formBuilder = _formBuilder;
        this.initForm();
        this.save = new core_1.EventEmitter();
    }
    TipoEmpresaSave.prototype.initForm = function () {
        this.title = new common_1.Control("", common_1.Validators.compose([common_1.Validators.required]));
        this.icon = new common_1.Control("", common_1.Validators.compose([common_1.Validators.required]));
        this.form = this._formBuilder.group({
            title: this.title,
            icon: this.icon,
        });
    };
    TipoEmpresaSave.prototype.submitForm = function () {
        this.save.emit(this.form);
    };
    TipoEmpresaSave = __decorate([
        core_1.Component({
            selector: 'tipoEmpresa-save',
            templateUrl: 'app/tipoEmpresa/save.html',
            styleUrls: ['app/tipoEmpresa/style.css'],
            inputs: ['idModal'],
            outputs: ['save'],
        }), 
        __metadata('design:paramtypes', [common_1.FormBuilder])
    ], TipoEmpresaSave);
    return TipoEmpresaSave;
}());
exports.TipoEmpresaSave = TipoEmpresaSave;
