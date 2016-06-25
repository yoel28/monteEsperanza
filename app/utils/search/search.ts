import { Component,EventEmitter } from '@angular/core';
import { Http} from '@angular/http';
import {RestController} from "../../common/restController";

@Component({
    selector: 'search',
    templateUrl: 'app/utils/search/index.html',
    styleUrls: ['app/utils/search/style.css'],
    inputs:['params'],
    outputs:['result'],
})
export class Search extends RestController{

    // Parametro de entrada
    // public searchVehiculo={
    //     title:"Vehiculo",
    //     idModal:"searchVehiculo",
    //     endpointForm:"/search/vehicles/",
    //     placeholderForm:"Ingrese la placa",
    //     labelForm:{name:"Nombre: ",detail:": "},
    //     where:&where[['op':'eq','field':'vehicle','value':'IsNull']]
    // }

    public params:any={};
    public result:any;

    constructor(public http:Http) {
        super(http);
        this.setEndpoint(this.params.endpointForm);
        this.result = new EventEmitter();
    }
    getSearch(search){
        this.endpoint=this.params.endpointForm+search;
        this.loadData();
    }
    loadData(offset=0){
        this.offset=offset;
        if(this.params.where)
            this.httputils.onLoadList(this.endpoint+"?max="+this.max+"&offset="+this.offset+this.params.where,this.dataList,this.max,this.error);
        else
            this.httputils.onLoadList(this.endpoint+"?max="+this.max+"&offset="+this.offset,this.dataList,this.max,this.error);
    };
    getData(data){
        this.result.emit(data);
    }
}

