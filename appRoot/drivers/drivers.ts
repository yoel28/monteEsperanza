import {Component, OnInit,ViewChild,Injectable} from '@angular/core';
import {Router}           from '@angular/router-deprecated';
import {Http} from '@angular/http';
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {globalService} from "../common/globalService";
import { ControllerBase} from "../common/ControllerBase";
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";
import {Filter} from "../utils/filter/filter";
import {Tables} from "../utils/tables/tables";
import {Save} from "../utils/save/save";
import {Tooltip} from "../utils/tooltips/tooltips";
import {MDrivers} from "./MDrivers";
declare var SystemJS:any;

@Component({
    selector: 'drivers',
    templateUrl: SystemJS.map.app+'/drivers/index.html',
    styleUrls: [SystemJS.map.app+'/drivers/style.css'],
    providers: [TranslateService],
    directives: [Filter,Tables,Save],
    pipes: [TranslatePipe]
})
export class Drivers extends ControllerBase implements OnInit {

    public dataSelect:any = {};
    public paramsTable:any={};
    public model;

    constructor(public router:Router, public http:Http, public toastr:ToastsManager, public myglobal:globalService, public translate:TranslateService) {
        super('CHOFER', '/drivers/',router, http, toastr, myglobal, translate);
        this.model= new MDrivers(myglobal);
    }
    ngOnInit(){
        this.initModel();
        this.loadParamsTable();
        this.loadPage();
    }
    initPermissions() {
        this.permissions = this.model.permissions;
    }
    initViewOptions() {
        this.max=10;

        this.viewOptions["title"] = 'Choferes';

        this.viewOptions["buttons"].push({
            'visible': this.permissions.add,
            'title': 'Agregar',
            'class': 'btn btn-green',
            'icon': 'fa fa-save',
            'modal': this.paramsSave.idModal
        });

        this.viewOptions["buttons"].push({
            'visible': this.permissions.filter,
            'title': 'Filtrar',
            'class': 'btn btn-blue',
            'icon': 'fa fa-filter',
            'modal': this.paramsFilter.idModal
        });

        this.viewOptions.actions.delete = {
            'title': 'Eliminar',
            'visible': this.permissions.delete,
            'idModal': this.prefix+'_'+this.configId+'_del',
            'message': 'Estás seguro que deseas eliminar chofer ',
            'keyAction': 'code'
        };
    }
    initRules() {
        this.rules = this.model.rules;
    }
    initRulesSave(){
        this.rulesSave = this.model.rulesSave;
    }
    initParamsSearch() {
        this.paramsSearch.placeholder="Buscar chofer";
    }
    initRuleObject() {}
    initRulesAudit() {}
    initParamsSave() {
        this.paramsSave.title="Agregar información";
    }
    initParamsFilter() {
        this.paramsFilter.title="Filtrar choferes";
    }
    loadParamsTable(){
        this.paramsTable.endpoint=this.endpoint;
        this.paramsTable.actions={};
        this.paramsTable.actions.delete = {
            "icon": "fa fa-trash",
            "exp": "",
            'title': 'Eliminar',
            'idModal': this.prefix+'_'+this.configId+'_del',
            'permission': this.permissions.delete,
            'message': '¿ Esta seguro de eliminar la accion : ',
            'keyAction':'code'
        };
    }


}

