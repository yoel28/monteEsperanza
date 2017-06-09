import {Component, OnInit,AfterViewInit} from '@angular/core';
import {BaseView} from "../../../utils/baseView/baseView";
import {globalService} from "../../../common/globalService";
import {ScheduleModel} from "./schedule.model";

declare var SystemJS:any;

@Component({
    selector: 'schedule-component',
    templateUrl:SystemJS.map.app+'/utils/baseView/base.html',
    styleUrls: [SystemJS.map.app+'/utils/baseView/style.css'],
    directives: [BaseView],
})
export class ScheduleComponent implements OnInit,AfterViewInit{

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
        this.model= new ScheduleModel(this.myglobal);
    }

    initViewOptions() {
        this.viewOptions["title"] = 'Horario';
    }

    loadParamsTable(){
        this.paramsTable.actions={};
        this.paramsTable.actions.delete = {
            'message': '¿ Esta seguro de eliminar el horario: ',
            'keyAction':'code'
        };
    }
}
