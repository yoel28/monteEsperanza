import {Component, OnInit,ViewChild} from '@angular/core';
import {Router}           from '@angular/router-deprecated';
import {Http} from '@angular/http';
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {globalService} from "../common/globalService";
import {ModelBase} from "../common/modelBase";
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";
import {Filter} from "../utils/filter/filter";
import {Tables} from "../utils/tables/tables";
import {Save} from "../utils/save/save";
declare var SystemJS:any;

@Component({
    selector: 'info',
    templateUrl: SystemJS.map.app+'/tooltip/index.html',
    styleUrls: [SystemJS.map.app+'/tooltip/style.css'],
    providers: [TranslateService],
    directives: [Filter,Tables,Save],
    pipes: [TranslatePipe]
})
export class Tooltip extends ModelBase implements OnInit {

    public dataSelect:any = {};
    public paramsTable:any={};

    constructor(public router:Router, public http:Http, public toastr:ToastsManager, public myglobal:globalService, public translate:TranslateService) {
        super('INFO', '/infos/', http, toastr, myglobal, translate);
    }
    ngOnInit(){
        this.initModel();
        this.loadParamsTable();
        this.loadData();
    }
    initOptions() {
        this.max=10;
        
        this.viewOptions["title"] = 'Informacion (Ayudas)';

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
            'message': 'Estás seguro que deseas eliminar la ayuda ',
            'keyAction': 'code'
        };
    }
    initRules() {

        this.rules['code']={
            'type': 'text',
            'visible':true,
            'search': this.permissions.filter,
            'key': 'code',
            'icon': 'fa fa-key',
            'title': 'Codigo',
            'placeholder': 'Ingrese el codigo',
            'msg':{
                
            }
        }
        this.rules['color']={
            'type': 'select',
            'visible':true,
            'source': [
                {'value': 'fa fa-truck', 'text':'truck'},
                {'value': 'fa fa-car', 'text': 'car'},
                {'value': 'fa fa-bus', 'text': 'bus'},
                {'value': 'fa fa-taxi', 'text': 'taxi'},
            ],
            'search': this.permissions.filter,
            'key': 'color',
            'icon': 'fa fa-list',
            'title': 'Color',
            'placeholder': 'Ingrese el color',
        }
        this.rules['icon']={
            'type': 'select',
            'visible':true,
            'source': [
                {'value': 'fa fa-truck', 'text':'truck'},
                {'value': 'fa fa-car', 'text': 'car'},
                {'value': 'fa fa-bus', 'text': 'bus'},
                {'value': 'fa fa-taxi', 'text': 'taxi'},
            ],
            'search': this.permissions.filter,
            'key': 'icon',
            'icon': 'fa fa-list',
            'title': 'Icono',
            'placeholder': 'Ingrese el icono',
        }
        this.rules['title']={
            'type': 'text',
            'visible':true,
            'search': this.permissions.filter,
            'key': 'title',
            'icon': 'fa fa-key',
            'title': 'Título',
            'placeholder': 'Ingrese el título',
        }
        this.rules['visible']={
            'type': 'text',
            'visible':true,
            'search': this.permissions.filter,
            'key': 'code',
            'icon': 'fa fa-key',
            'title': 'Codigo',
            'placeholder': 'Ingrese el codigo',
        }

    }
    initSearch() {}
    initRuleObject() {}
    initPermissions() {}
    initFilter() {
        this.paramsFilter.title="Filtrar ayudas";
    }
    loadParamsTable(){
        this.paramsTable.endpoint=this.endpoint;
        this.paramsTable.actions={};
        this.paramsTable.actions.delete = {
            "icon": "fa fa-trash",
            "exp": "",
            'title': 'Eliminar',
            'permission': this.permissions.delete,
            'message': '¿ Esta seguro de eliminar la accion : ',
            'keyAction':'code'
        };
    }

}

