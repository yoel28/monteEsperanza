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

    }
    ngOnInit(){
        this.initModel();
        this.initViewOptions();
        this.loadParamsTable();
        this.loadPage();
    }
    initModel() {
        this.model= new MDrivers(this.myglobal);
    }
    initViewOptions() {
        this.viewOptions["title"] = 'Choferes';
        this.viewOptions["buttons"] = [];
        this.viewOptions["buttons"].push({
            'visible': this.model.permissions.add,
            'title': 'Agregar',
            'class': 'btn btn-green',
            'icon': 'fa fa-save',
            'modal': this.model.paramsSave.idModal
        });

        this.viewOptions["buttons"].push({
            'visible': this.model.permissions.filter,
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
            'message': '¿ Esta seguro de eliminar el chofer : ',
            'keyAction':'name'
        };
    }


}

