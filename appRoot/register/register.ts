import {Component, OnInit} from '@angular/core';
import {Router,RouteParams}           from '@angular/router-deprecated';
import {Http} from '@angular/http';
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {globalService} from "../common/globalService";
import { ControllerBase} from "../common/ControllerBase";
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";
import {Filter} from "../utils/filter/filter";
import {Save} from "../utils/save/save";
import {Tooltip} from "../utils/tooltips/tooltips";
import {Accordion} from "../utils/accordion/accordion";
import {MRegister} from "./MRegister";

declare var SystemJS:any;

@Component({
    selector: 'access-control-history',
    templateUrl: SystemJS.map.app+'/register/index.html',
    styleUrls: [ SystemJS.map.app+'/register/style.css'],
    providers: [TranslateService],
    directives: [Filter,Accordion,Save,Tooltip],
    pipes: [TranslatePipe]
})
export class Register extends ControllerBase implements OnInit {

    public dataSelect:any = {};
    public paramsAccordion:any={};

    constructor(public params:RouteParams,public router:Router, public http:Http, public toastr:ToastsManager, public myglobal:globalService, public translate:TranslateService) {
        super('REG','/registries/',router, http, toastr, myglobal, translate);
    }
    ngOnInit(){
        this.initModel();
        this.initViewOptions();
        this.loadParamsAccordion();
        this.loadPage();
    }
    initModel() {
        this.model= new MRegister(this.myglobal);
    }
    
    initViewOptions() {
        this.viewOptions["title"] = 'Registro y acceso';
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
    loadParamsAccordion(){
        this.paramsAccordion.headers = ['id','vehiclePlate','dateIn','dateOut'];

    }


}

