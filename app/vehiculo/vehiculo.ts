import { Component } from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http} from '@angular/http';
import {RestController} from "../common/restController";
import {VehiculoSave} from "./methods";
@Component({
    selector: 'vehiculo',
    templateUrl: 'app/vehiculo/index.html',
    styleUrls: ['app/vehiculo/style.css'],
    directives: [VehiculoSave],
})
export class Vehiculo extends RestController{

    public dataSelect:string;

    constructor(public router: Router,public http: Http) {
        super(http);
        this.validTokens();
        this.setEndpoint('/vehicles/');
        this.loadData();
    }
    validTokens(){
        if(!localStorage.getItem('bearer'))
        {
            let link = ['AccountLogin', {}];
            this.router.navigate(link);
        }
    }
    assignVehiculo(data){
        this.dataList.list.push(data);
    }
    public searchTag={
        title:"Tag RFID",
        idModal:"searchTag",
        endpointForm:"rfids?where[['op':'isNull','field':'vehicle']]",
        placeholderForm:"Seleccione un Tag",
        labelForm:{name:"Nombre: ",detail:"Detalle: "},
    }

}