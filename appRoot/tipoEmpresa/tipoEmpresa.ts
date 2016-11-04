import {Component, OnInit} from '@angular/core';
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
import {MTypeCompany} from "./MTypeCompany";

declare var SystemJS:any;

@Component({
    selector: 'tipoEmpresa',
    templateUrl: SystemJS.map.app+'/tipoEmpresa/index.html',
    styleUrls: [SystemJS.map.app+'/tipoEmpresa/style.css'],
    providers: [TranslateService],
    directives: [Filter,Tables,Save,Tooltip],
    pipes: [TranslatePipe]
})
export class TipoEmpresa extends ControllerBase implements OnInit {

    public dataSelect:any = {};
    public paramsTable:any={};
    public model;

    constructor(public router:Router, public http:Http, public toastr:ToastsManager, public myglobal:globalService, public translate:TranslateService) {
        super('GROUP','/type/companies/',router, http, toastr, myglobal, translate);
        this.model= new MTypeCompany(myglobal);
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

        this.viewOptions["title"] = 'Grupos';

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
        
    }
    initRules() {
        this.rules = this.model.rules;
    }
    initRulesSave(){
        this.rulesSave = this.model.rulesSave;
    }
    initParamsSearch() {
        this.paramsSearch.placeholder="Buscar grupos";
    }
    initRuleObject() {}
    initRulesAudit() {}
    initParamsSave() {
        this.paramsSave.title="Agregar grupo";
    }
    initParamsFilter() {
        this.paramsFilter.title="Filtrar grupo";
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
            'message': '¿ Esta seguro de eliminar el grupo : ',
            'keyAction':'code'
        };
    }


}

