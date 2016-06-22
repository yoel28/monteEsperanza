import { Component } from '@angular/core';
import { Router,RouteParams }           from '@angular/router-deprecated';
import  {FormBuilder} from '@angular/common';
import { Http } from '@angular/http';
import {RecargaSave} from "../recarga/methods";
import {RestController} from "../common/restController";


@Component({
    selector: 'taquilla',
    templateUrl: 'app/taquilla/index.html',
    styleUrls: ['app/taquilla/style.css'],
    directives:[RecargaSave]
})
export class Taquilla extends RestController{
    dataVehicles:any = {};
    dataTruck:any = {};
    search;

    constructor(params:RouteParams,public router: Router,http: Http,_formBuilder: FormBuilder) {
        super(http);
        this.validTokens();

        if(params.get('search'))
        {
            this.getVehicles(params.get('search'));
            this.search = params.get('search');
        }
    }
    validTokens(){
        if(!localStorage.getItem('bearer'))
        {
            let link = ['AccountLogin', {}];
            this.router.navigate(link);
        }
    }
    getVehicle(truckId:string){
        this.httputils.onLoadList("/vehicles/"+truckId,this.dataTruck,this.error);
        this.dataVehicles = {};
    }

    getVehicles(camion:string){
        this.dataTruck = {};
        this.httputils.onLoadList("/search/vehicles/"+camion,this.dataVehicles,this.error);
    }
}



