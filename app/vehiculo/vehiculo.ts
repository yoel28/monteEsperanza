import { Component } from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http} from '@angular/http';
import {RestController} from "../common/restController";
import {VehiculoSave} from "./methods";
import {Search} from "../utils/search/search"
import {Json} from "@angular/platform-browser/src/facade/lang";
@Component({
    selector: 'vehiculo',
    templateUrl: 'app/vehiculo/index.html',
    styleUrls: ['app/vehiculo/style.css'],
    directives: [VehiculoSave,Search],
})
export class Vehiculo extends RestController{

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

    //Buscar tag sin vehiculo ---------------------------------------------
    public dataSelect:string;

    public searchTag={
        title:"Tag",
        idModal:"searchTag",
        endpointForm:"/search/rfids/",
        placeholderForm:"Seleccione un Tag",
        labelForm:{name:"Numero: ",detail:"Detalle: "},
        where:"&where=[['op':'isNull','field':'vehicle.id']]"
    }
    //asignar tag a vehiculo
    assignTag(data){
        let successCallBack = response=>{
            let index = this.dataList.list.findIndex(obj => obj.id == this.dataSelect);
            this.dataList.list[index].tagRFID = response.json().number;
        }
        let body=Json.stringify({'vehicle':this.dataSelect})
        this.httputils.doPut('/rfids/'+data.id,body,successCallBack,this.error)
    }

}