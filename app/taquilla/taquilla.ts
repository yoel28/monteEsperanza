import { Component } from '@angular/core';
import { Router,RouteParams }           from '@angular/router-deprecated';
import  {FormBuilder} from '@angular/common';
import { Http } from '@angular/http';
import {RecargaSave} from "../recarga/methods";
import {RestController} from "../common/restController";
import {Fecha} from "../utils/pipe";


@Component({
    selector: 'taquilla',
    pipes: [Fecha],
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
        let successCallback= response => {
            Object.assign(this.dataTruck, response.json());
            this.dataTruck['recharges']=[];
            this.loadData();
        }
        this.httputils.doGet("/vehicles/"+truckId,successCallback,this.error)
        this.dataVehicles = {};
    }
    loadData(offset=0){
        this.offset=offset;
        this.endpoint="/search/recharges";
        this.httputils.onLoadList(this.endpoint+"?where=[['op':'eq','field':'vehicle.id','value':"+this.dataTruck.id+"l]]"+"&max="+this.max+"&offset="+this.offset,this.dataList,this.max,this.error);
    };

    getVehicles(camion:string,offset=0){
        this.offset=offset;
        this.dataTruck = {};
        this.httputils.onLoadList("/search/vehicles/"+camion+"?max="+this.max+"&offset="+this.offset, this.dataVehicles,this.max,this.error);

    }
    assignRecarga(data){
        this.dataTruck.balance+=data.quantity;
        this.dataList.list.unshift(data);
    }
}



