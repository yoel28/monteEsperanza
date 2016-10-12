import {Component, OnInit} from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {globalService} from "../common/globalService";
import {Filter} from "../utils/filter/filter";
import {ControllerBase} from "../common/ControllerBase";
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";
import {MRegla} from "./MRegla";
import {Save} from "../utils/save/save";
import {Tables} from "../utils/tables/tables";
declare var SystemJS:any;

@Component({
    selector: 'regla',
    templateUrl: SystemJS.map.app+'/regla/index.html',
    styleUrls: [SystemJS.map.app+'/regla/style.css'],
    providers: [TranslateService],
    directives: [Filter,Tables,Save],
    pipes: [TranslatePipe]
})
export class Regla extends ControllerBase implements OnInit{
    public dataSelect:any={};
    public paramsTable:any={};
    public model:any;

    constructor(public router: Router,public http: Http,toastr:ToastsManager,public myglobal:globalService,public translate:TranslateService) {
        super('RULE','/rules/',router,http,toastr,myglobal,translate);
        this.model= new MRegla(myglobal);
    }
    ngOnInit(){
        this.initModel();
        this.loadParamsTable();
        this.loadPage();
    }
    initPermissions() {}
    initRules() {
        this.rules = this.model.rules;
    }
    initRulesAudit() {}
    initViewOptions() {
        this.max=10;

        this.viewOptions["title"] = 'Reglas';

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
            'message': 'Estás seguro que deseas eliminar la regla ',
            'keyAction': 'code'
        };
    }
    initRulesSave() {
        this.rulesSave=Object.assign({},this.rules);
        delete this.rulesSave.enabled;
    }
    initParamsSave() {
        this.paramsSave.title="Agregar regla"
    }
    initParamsSearch() {}
    initParamsFilter() {
        this.paramsFilter.title="Filtrar reglas";
    }
    initRuleObject() {}
    loadParamsTable(){
        this.paramsTable.endpoint=this.endpoint;
        this.paramsTable.actions={};
        this.paramsTable.actions.delete = {
            "icon": "fa fa-trash",
            "exp": "",
            'title': 'Eliminar',
            'idModal': this.prefix+'_'+this.configId+'_del',
            'permission': this.permissions.delete,
            'message': '¿ Esta seguro de eliminar la regla: ',
            'keyAction':'name'
        };
    }

    

}