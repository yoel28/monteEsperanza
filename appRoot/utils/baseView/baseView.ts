import {Component, OnInit} from '@angular/core';
import {Router}           from '@angular/router-deprecated';
import {Http} from '@angular/http';
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {globalService} from "../../common/globalService";
import { ControllerBase} from "../../common/ControllerBase";
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";
import {Filter} from "../filter/filter";
import {Tables} from "../tables/tables";
import {Save} from "../save/save";
import {Tooltip} from "../tooltips/tooltips";

declare var SystemJS:any;

@Component({
    selector: 'base-view',
    templateUrl: SystemJS.map.app+'/utils/baseView/index.html',
    styleUrls: [SystemJS.map.app+'/utils/baseView/style.css'],
    providers: [TranslateService],
    inputs:['instance'],
    directives: [Filter,Tables,Save,Tooltip],
    pipes: [TranslatePipe]
})
export class BaseView extends ControllerBase implements OnInit {

    public instance:any;

    public dataSelect:any = {};
    public paramsTable:any={};

    constructor(public router:Router, public http:Http, public toastr:ToastsManager, public myglobal:globalService, public translate:TranslateService) {
        super('NOPREFIX','/NOENDPOINT/',router, http, toastr, myglobal, translate);
    }
    ngOnInit(){
        this.initModel();
        this.initParams();
        this.initViewOptions();
        this.loadParamsTable();
        this.loadPage();
    }
    initModel() {
        this.model = this.instance.model;
    }
    initParams(){
        this.prefix = this.model.prefix;
        this.setEndpoint(this.model.endpoint);
    }
    initViewOptions() {
        this.viewOptions["title"] = this.instance.viewOptions.title;
        this.viewOptions["buttons"] = [];
        
        this.viewOptions["buttons"].push({
            'visible': this.model.permissions.add,
            'title': 'Agregar',
            'class': 'btn btn-green',
            'icon': 'fa fa-save',
            'modal': this.model.paramsSave.idModal
        });
        this.viewOptions["buttons"].push({
            'visible': this.model.permissions.filter && this.model.permissions.list,
            'title': 'Filtrar',
            'class': 'btn btn-blue',
            'icon': 'fa fa-filter',
            'modal': this.model.paramsSearch.idModal
        });
    }
    loadParamsTable(){
        this.paramsTable.endpoint=this.endpoint;
        this.paramsTable.actions={};

        if(this.instance.paramsTable && this.instance.paramsTable.actions && this.instance.paramsTable.actions.delete )
        {
            this.paramsTable.actions.delete = {
                "icon": "fa fa-trash",
                "exp": "",
                'title': 'Eliminar',
                'idModal': this.prefix+'_'+this.configId+'_DEL',
                'permission': this.model.permissions.delete,
                'message': this.instance.paramsTable.actions.delete.message,
                'keyAction':this.instance.paramsTable.actions.delete.keyAction
            };
        }
        if(this.instance.paramsTable && this.instance.paramsTable.where)
            this.where = this.instance.paramsTable.where;
        
    }


}

