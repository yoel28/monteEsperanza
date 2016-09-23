import {Component, OnInit,ViewChild} from '@angular/core';
import {Router}           from '@angular/router-deprecated';
import {Http} from '@angular/http';
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {globalService} from "../common/globalService";
import {ModelBase} from "../common/modelBase";
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";
import moment from "moment/moment";
import {Filter} from "../utils/filter/filter";
declare var SystemJS:any;

@Component({
    selector: 'info',
    templateUrl: SystemJS.map.app+'/tooltip/index.html',
    styleUrls: [SystemJS.map.app+'/tooltip/style.css'],
    providers: [TranslateService],
    directives: [Filter],
    pipes: [TranslatePipe]
})
export class Info extends ModelBase implements OnInit {

    public dataSelect:any = {};
    public typeView=2;
    public baseWeight=1;

    constructor(public router:Router, public http:Http, public toastr:ToastsManager, public myglobal:globalService, public translate:TranslateService) {
        super('INFO', '/infos/', http, toastr, myglobal, translate);
    }
    ngOnInit(){
        this.initModel();
        this.loadData();
    }
    
    initOptions() {
        this.max=10;
        
        this.viewOptions["title"] = 'Informacion (Ayudas)';
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
        this.viewOptions.actions.add = {
            'visible': this.permissions.add,
            'modalId':'cargaInfo'
        };
    }

    initRules() {

        this.rules['code']={
            'type': 'text',
            'visible':true,
            'search': true,
            'key': 'code',
            'icon': 'fa fa-key',
            'title': 'Codigo',
            'placeholder': 'Ingrese el codigo',
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
            'search': true,
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
            'search': true,
            'key': 'icon',
            'icon': 'fa fa-list',
            'title': 'Icono',
            'placeholder': 'Ingrese el icono',
        }
        this.rules['title']={
            'type': 'text',
            'visible':true,
            'search': true,
            'key': 'title',
            'icon': 'fa fa-key',
            'title': 'Título',
            'placeholder': 'Ingrese el título',
        }
        this.rules['visible']={
            'type': 'text',
            'visible':true,
            'search': true,
            'key': 'code',
            'icon': 'fa fa-key',
            'title': 'Codigo',
            'placeholder': 'Ingrese el codigo',
        }

    }

    initSearch() {
    }

    initRuleObject() {
    }

    initFilter() {
        this.paramsFilter.title="Filtrar ayudas"
    }

    initPermissions() {
    }
}

