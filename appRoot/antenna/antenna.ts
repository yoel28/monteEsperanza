import {Component, OnInit,AfterViewInit} from '@angular/core';
import {globalService} from "../common/globalService";
import {MAntenna} from "./MAntenna";
import {BaseView} from "../utils/baseView/baseView";
declare var SystemJS:any;

@Component({
    selector: 'antenna',
    templateUrl: SystemJS.map.app+'/antenna/index.html',
    styleUrls: [SystemJS.map.app+'/antenna/style.css'],
    directives: [BaseView],
})
export class Antenna implements OnInit,AfterViewInit{

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
        this.model= new MAntenna(this.myglobal);
    }
    initViewOptions() {
        this.viewOptions["title"] = 'Antenas';
    }
    loadParamsTable(){
        this.paramsTable.actions={};
        this.paramsTable.actions.delete = {
            'message': '¿ Esta seguro de eliminar la antena : ',
            'keyAction':'reference'
        };
    }


}

