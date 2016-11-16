import { Component,EventEmitter } from '@angular/core';
import { Http} from '@angular/http';
import {RestController} from "../../common/restController";
declare var SystemJS:any;
@Component({
    selector: 'search',
    templateUrl: SystemJS.map.app+'/utils/search/index.html',
    styleUrls: [SystemJS.map.app+'/utils/search/style.css'],
    inputs:['params'],
    outputs:['result'],
})
export class Search extends RestController{

    // Parametro de entrada
    // public searchVehiculo={
    //     title:"Vehiculo",
    //     idModal:"searchVehiculo",
    //     endpoint:"/search/vehicles/",
    //     placeholder:"Ingrese la placa",
    //     label:{name:"Nombre: ",detail:": "},
    //     where:&where[['op':'eq','field':'vehicle','value':'IsNull']]
    // }

    public params:any={};
    public result:any;

    constructor(public http:Http) {
        super(http);
        this.result = new EventEmitter();
    }
    ngOnInit(){
        this.max = 5;
        this.setEndpoint(this.params.endpoint);
    }
    getSearch(search){
        this.endpoint=this.params.endpoint+search;
        this.where = this.params.where || "";
        this.loadData();
    }
    getData(data){
        this.result.emit(data);
    }
}

