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
import {MEvent} from "./MEvent";
declare var SystemJS:any;

@Component({
    selector: 'event',
    templateUrl: SystemJS.map.app+'/event/index.html',
    styleUrls: [SystemJS.map.app+'/event/style.css'],
    providers: [TranslateService],
    directives: [Filter,Tables,Save],
    pipes: [TranslatePipe]
})
export class Events extends ControllerBase implements OnInit {

    public dataSelect:any = {};
    public paramsTable:any={};
    public dataPublic:any={};
    public model:any;

    constructor(public router:Router, public http:Http, public toastr:ToastsManager, public myglobal:globalService, public translate:TranslateService) {
        super('EVENT', '/events/',router, http, toastr, myglobal, translate);
        this.model= new MEvent(myglobal,http);
    }
    ngOnInit(){
        this.initModel();
        this.loadParamsTable();
        this.loadPublicData();
        this.loadPage();
    }
    initViewOptions() {
        this.max=10;
        
        this.viewOptions["title"] = 'Eventos';

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
            'message': 'Estás seguro que deseas eliminar la ayuda ',
            'keyAction': 'code'
        };
    }
    initRules() {
        this.rules = this.model.rules;
    }
    initRulesSave(){
        this.rulesSave=Object.assign({},this.rules);
        delete this.rulesSave.enabled;
    }
    initParamsSearch() {}
    initRuleObject() {}
    initPermissions() {}
    initRulesAudit() {}
    initParamsSave() {
        this.paramsSave.title="Agregar evento"
    }
    initParamsFilter() {
        this.paramsFilter.title="Filtrar eventos";
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
            'message': '¿ Esta seguro de eliminar el evento : ',
            'keyAction':'code'
        };
    }
    loadPublicData(){
        this.onloadData('',this.dataPublic);
    }

}

