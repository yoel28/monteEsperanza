import { Component } from '@angular/core';
import { Router,RouteParams }           from '@angular/router-deprecated';
import  {FormBuilder} from '@angular/common';
import { Http } from '@angular/http';
import {RecargaSave} from "../recarga/methods";
import {RestController} from "../common/restController";
import {Fecha} from "../utils/pipe";
import {globalService} from "../common/globalService";


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

    constructor(public params:RouteParams,public router: Router,http: Http,_formBuilder: FormBuilder,public myglobal:globalService) {
        super(http);
    }
    ngOnInit(){
        if(this.params.get('search'))
        {
            this.getVehicles(this.params.get('search'));
            this.search = this.params.get('search');
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



