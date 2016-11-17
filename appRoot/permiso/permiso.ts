import {Component, OnInit,AfterViewInit} from '@angular/core';
import {globalService} from "../common/globalService";
import {MPermission} from "./MPermission";
import {BaseView} from "../utils/baseView/baseView";
declare var SystemJS:any;
@Component({
    selector: 'permission',
    templateUrl: SystemJS.map.app+'/permiso/index.html',
    styleUrls: [SystemJS.map.app+'/permiso/style.css'],
    directives: [BaseView],
})
export class Permiso implements OnInit,AfterViewInit{

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
        this.model= new MPermission(this.myglobal);
    }
    initViewOptions() {
        this.viewOptions["title"] = 'Permisos';
    }
    loadParamsTable(){
        this.paramsTable.actions={};
        this.paramsTable.actions.delete = {
            'message': '¿ Esta seguro de eliminar el permiso : ',
            'keyAction':'code'
        };
    }
}