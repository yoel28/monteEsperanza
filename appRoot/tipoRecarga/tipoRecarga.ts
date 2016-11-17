import {Component, OnInit,AfterViewInit} from '@angular/core';
import {globalService} from "../common/globalService";
import {BaseView} from "../utils/baseView/baseView";
import {MtypeRecharge} from "./MtypeRecharge";

declare var SystemJS:any;

@Component({
    selector: 'tipo-recarga',
    templateUrl:SystemJS.map.app+'/utils/baseView/base.html',
    styleUrls: [SystemJS.map.app+'/utils/baseView/style.css'],
    directives: [BaseView],

})
export class TipoRecarga implements OnInit,AfterViewInit {

    public instance:any = {};
    public paramsTable:any = {};
    public model:any;
    public viewOptions:any = {};

    constructor(public myglobal:globalService) {
    }

    ngOnInit() {
        this.initModel();
        this.initViewOptions();
        this.loadParamsTable();
    }

    ngAfterViewInit():any {
        this.instance = {
            'model': this.model,
            'viewOptions': this.viewOptions,
            'paramsTable': this.paramsTable
        };
    }

    initModel():any {
        this.model = new MtypeRecharge(this.myglobal);
    }

    initViewOptions() {
        this.viewOptions["title"] = 'Tipo de recarga';
    }

    loadParamsTable() {
        this.paramsTable.actions = {};
        this.paramsTable.actions.delete = {
            'message': '¿ Esta seguro de eliminar el tipo de recarga : ',
            'keyAction': 'title'
        };
    }
}