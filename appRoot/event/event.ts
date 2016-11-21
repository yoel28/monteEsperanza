import {Component, OnInit,AfterViewInit} from '@angular/core';
import {Http} from '@angular/http';
import {globalService} from "../common/globalService";
import {MEvent} from "./MEvent";
import {BaseView} from "../utils/baseView/baseView";
declare var SystemJS:any;

@Component({
    selector: 'event',
    templateUrl:SystemJS.map.app+'/utils/baseView/base.html',
    styleUrls: [SystemJS.map.app+'/utils/baseView/style.css'],
    directives: [BaseView],
})
export class Events implements OnInit,AfterViewInit{

    public instance:any={};
    public paramsTable:any={};
    public model:any;
    public viewOptions:any={};

    constructor(public myglobal:globalService,public http:Http) {}

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
        this.model= new MEvent(this.myglobal,this.http);
    }

    initViewOptions() {
        this.viewOptions["title"] = 'Eventos';
    }
    loadParamsTable(){
       this.paramsTable.actions={};
        this.paramsTable.actions.delete = {
            'message': '¿ Esta seguro de eliminar el evento : ',
            'keyAction':'code'
        };
    }

}

