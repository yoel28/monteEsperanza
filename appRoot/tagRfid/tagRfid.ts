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
import {MTag} from "./MTag";

declare var SystemJS:any;
@Component({
    selector: 'tagRfid',
    templateUrl: SystemJS.map.app+'/tagRfid/index.html',
    styleUrls: [SystemJS.map.app+'/tagRfid/style.css'],
    providers: [TranslateService],
    directives: [Filter,Tables,Save,Tooltip],
    pipes: [TranslatePipe]
})
export class TagRfid extends ControllerBase implements OnInit {
    
    public paramsTable:any={};

    constructor(public router:Router, public http:Http, public toastr:ToastsManager, public myglobal:globalService, public translate:TranslateService) {
        super('TAG', '/rfids/',router, http, toastr, myglobal, translate);

    }
    ngOnInit(){
        this.initModel();
        this.initViewOptions();
        this.loadParamsTable();
        this.loadPage();
    }
    initModel() {
        this.model= new MTag(this.myglobal);
    }
    initViewOptions() {
        this.viewOptions["title"] = 'Tag RFID';
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
            'message': '¿ Esta seguro de eliminar el tag : ',
            'keyAction':'number'
        };
        /*
        this.paramsTable.actions.edit = {
            "icon": "fa fa-pencil-square-o fa-lg",
            "exp": "",
            'title': 'Editar',
            'idModal': this.prefix+'_'+this.configId+'_add',
            'permission': this.model.permissions.update,
        };*/
        this.paramsTable.prefix=this.prefix;
        
    }


}