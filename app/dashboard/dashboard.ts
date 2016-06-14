import { Component } from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import {HttpUtils} from "../common/http-utils";


@Component({
    selector: 'home',
    templateUrl: 'app/dashboard/dashboard.html',
    styleUrls: ['app/dashboard/dashboard.css']
})
export class Dashboard {
    dataCamion:any = [];
    httputils:HttpUtils;
    endpoint:string;

    constructor(router: Router,http: Http) {
        if(!localStorage.getItem('bearer'))
        {
            let link = ['AccountLogin', {}];
            router.navigate(link);
        }
        this.endpoint="/users/";
        this.httputils = new HttpUtils(http);
    }
    getCamion(camion:string){
        //this.httputils.onLoadList("/camion/"+camion,this.data,this.error);
        this.httputils.onLoadList("consultas/DetalleCamion.json",this.dataCamion,this.error,true);
        console.log("Peticion GetCamion "+camion);
    }
    getDataCamion(){
        if(this.dataCamion.camion)
            return true;
        return false;
    }

    error=function(err){
        console.log(err);
    }
}


