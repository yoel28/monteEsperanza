import {Component, OnInit,AfterViewInit} from '@angular/core';
import {globalService} from "../common/globalService";
import {BaseView} from "../utils/baseView/baseView";
import {MPlanning} from "./MPlanning";

declare var SystemJS:any;
@Component({
    selector: 'planning',
    templateUrl:SystemJS.map.app+'/utils/baseView/base.html',
    styleUrls: [SystemJS.map.app+'/utils/baseView/style.css'],
    directives: [BaseView],
})
export class Planning implements OnInit,AfterViewInit{

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
        this.model= new MPlanning(this.myglobal);
    }

    initViewOptions() {
        this.viewOptions["title"] = 'Planificación';
    }

    loadParamsTable(){
        this.paramsTable.actions={};
        this.paramsTable.actions.delete = {
            'message': '¿ Esta seguro de eliminar la planificación para el vehiculo: ',
            'keyAction':'vehiclePlate'
        };

        this.paramsTable.actions.duplicate = {
            permission:'PLANNING_UPDATE',
            idModal:this.model.paramsSave.idModal,
            icon:'fa fa-files-o',
            title:'Duplicar',
            callback:(bv:BaseView,data:any)=>{
                bv.save.resetForm();
                bv.save.getDataSearch({id:data.vehicleId,detail:data.vehiclePlate},'vehicle');
                bv.save.getDataSearch({id:data.driverId,detail:data.driverName},'driver');
                bv.save.getDataSearch({id:data.routeId,detail:data.routeReference},'route');
                bv.save.setValueSelect(data.detail,'detail');

                data.helpers.forEach(value=>{
                    let index = this.model.rules['helpers'].source.findIndex(obj => (obj.id == value ));
                    if(index>-1){
                        this.model.rules['helpers'].instance.addValue(
                            this.model.rules['helpers'].source[index]
                        );
                    }

                })

            }
        };

        this.paramsTable.where = "&where="+encodeURI("[['op':'eq','field':'enabled','value':true]]");
    }
}