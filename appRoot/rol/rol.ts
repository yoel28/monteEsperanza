import {Component, OnInit,AfterViewInit} from '@angular/core';
import {globalService} from "../common/globalService";
import {BaseView} from "../utils/baseView/baseView";
import {MRol} from "./MRol";

declare var SystemJS:any;
@Component({
    selector: 'rol',
    templateUrl:SystemJS.map.app+'/utils/baseView/base.html',
    styleUrls: [SystemJS.map.app+'/utils/baseView/style.css'],
    directives: [BaseView],
})
export class Rol implements OnInit,AfterViewInit{

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

    initModel():any {
        this.model= new MRol(this.myglobal);
    }

    initViewOptions() {
        this.viewOptions["title"] = 'Roles';
    }

    loadParamsTable(){
        this.paramsTable.actions={};
        this.paramsTable.actions.delete = {
            'message': '¿ Esta seguro de eliminar el rol : ',
            'keyAction':'authority'
        };
    }
}