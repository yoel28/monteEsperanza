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

    }
    ngOnInit(){
        this.initModel();
        this.initViewOptions();
        this.loadParamsTable();
        this.loadPublicData();
        this.loadPage();
    }
    initModel() {
        this.model= new MEvent(this.myglobal,this.http);
    }
    initViewOptions() {
        this.max=10;
        
        this.viewOptions["title"] = 'Eventos';
        this.viewOptions["buttons"] = [];
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
            'message': '¿ Esta seguro de eliminar el evento : ',
            'keyAction':'code'
        };
    }
    loadPublicData(){
        this.onloadData('',this.dataPublic);
    }

}

