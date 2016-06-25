import { Component } from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import {RestController} from "../common/restController";
import {TagSave} from "./methods";
import {Search} from "../utils/search/search";


@Component({
    selector: 'tagRfid',
    templateUrl: 'app/tagRfid/index.html',
    styleUrls: ['app/tagRfid/style.css'],
    directives:[TagSave,Search],
})
export class TagRfid extends RestController{

    constructor(public router: Router,public http: Http) {
        super(http);
        this.validTokens();
        this.setEndpoint('/rfids/');
        this.loadData();

    }
    validTokens(){
        if(!localStorage.getItem('bearer'))
        {
            let link = ['AccountLogin', {}];
            this.router.navigate(link);
        }
    }
    assignTag(data){
        this.dataList.list.push(data);
    }
    //Buscar vehiculos sin tag ---------------------------------------------
    public dataSelect:string;
    public searchVehicle={
        title:"Vehiculo",
        idModal:"searchVehicle",
        endpointForm:"/search/vehicles/",
        placeholderForm:"Ingrese la placa del vehiculo",
        labelForm:{name:"Placa: ",detail:"Empresa: "},
        where:"&where=[['op':'isNull','field':'tag.id']]"
    }
    //asignar tag a vehiculo
    assignVehicle(data){
        let index = this.dataList.list.findIndex(obj => obj.id == this.dataSelect);
        this.onPatch('vehicle',this.dataList.list[index],data.id);
    }
}