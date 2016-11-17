import {Component, OnInit,AfterViewInit} from '@angular/core';
import {globalService} from "../common/globalService";
import {BaseView} from "../utils/baseView/baseView";
import {MParams} from "./MParams";

declare var SystemJS:any;
@Component({
    selector: 'parametro',
    templateUrl:SystemJS.map.app+'/utils/baseView/base.html',
    styleUrls: [SystemJS.map.app+'/utils/baseView/style.css'],
    directives: [BaseView],
})
export class Parametro implements OnInit,AfterViewInit{

    public instance:any={};
    public paramsTable:any={};
    public model:any;
    public viewOptions:any={};

    constructor(public myglobal:globalService) {}

    ngOnInit(){
        this.initModel();
        this.initViewOptions();
        this.loadParamsTable();
    }

    ngAfterViewInit():any {
        this.instance = {
            'model':this.model,
            'viewOptions':this.viewOptions,
            'paramsTable':this.paramsTable
        };
    }

    initModel() {
        this.model= new MParams(this.myglobal);
    }

    initViewOptions() {
        this.viewOptions["title"] = 'Parámetros';
    }

    loadParamsTable(){
        this.paramsTable.actions={};
        this.paramsTable.actions.delete = {
            'message': '¿ Esta seguro de eliminar el parámetro : ',
            'keyAction':'key'
        };
    }
}