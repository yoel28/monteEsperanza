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

    constructor(public router: Router,public http: Http,toastr:ToastsManager,public myglobal:globalService,public translate:TranslateService) {
        super('RULE','/rules/',router,http,toastr,myglobal,translate);
    }
    ngOnInit(){
        this.initModel();
        this.initViewOptions();
        this.loadParamsTable();
        this.loadPage();
    }
    initModel() {
        this.model= new MRegla(this.myglobal);
    }
    initViewOptions() {
        this.max=10;

        this.viewOptions["title"] = 'Reglas';
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
        this.paramsTable.actions.delete = {
            "icon": "fa fa-trash",
            "exp": "",
            'title': 'Eliminar',
            'idModal': this.prefix+'_'+this.configId+'_del',
            'permission': this.model.permissions.delete,
            'message': '¿ Esta seguro de eliminar la regla: ',
            'keyAction':'name'
        };
    }

    

}