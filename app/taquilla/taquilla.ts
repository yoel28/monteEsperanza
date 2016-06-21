import { Component } from '@angular/core';
import { Router,RouteParams }           from '@angular/router-deprecated';
import  {FormBuilder, Validators, Control, ControlGroup,} from '@angular/common';
import { Http } from '@angular/http';
import {HttpUtils} from "../common/http-utils";


@Component({
    selector: 'taquilla',
    templateUrl: 'app/taquilla/index.html',
    styleUrls: ['app/taquilla/style.css']
})
export class Taquilla {
    dataVehicles:any = {};
    dataTruck:any = {};

    httputils:HttpUtils;

    form: ControlGroup;
    quantity: Control;
    reference: Control;
    referenceDate: Control;
    search;

    rechargeTypes:any = []; //Arreglo con todos los tipos de regarga
    rechargeType:any = {}; //tipo de recarga selecccionada


    constructor(params:RouteParams,router: Router,http: Http,_formBuilder: FormBuilder) {
        if(!localStorage.getItem('bearer'))
        {
            let link = ['AccountLogin', {}];
            router.navigate(link);
        }
        //TODO Enpoint Real
        this.httputils = new HttpUtils(http);

        this.quantity = new Control("", Validators.compose([Validators.required]));
        this.reference = new Control("", Validators.compose([Validators.required]));
        this.referenceDate = new Control("", Validators.compose([Validators.required]));

        this.form = _formBuilder.group({
            quantity: this.quantity,
            reference: this.reference,
            referenceDate: this.referenceDate,
        });
        this.getRechargeTypes();
        if(params.get('search'))
        {
            this.getVehicles(params.get('search'));
            this.search = params.get('search');
        }

        


    }

    getRecharge(event: Event) {
        let json = Object.assign({"vehicle": {id: this.dataTruck.id},"rechargeType":{id:this.rechargeType.id}},this.form.value);
        let body = JSON.stringify(json);
        let that =  this;
        let successCallback= response => {
            that.getVehicle(that.dataTruck.id);
        }
        this.httputils.doPost('/recharges',body,successCallback,this.error);
    }

    getVehicle(truckId:string){
        this.httputils.onLoadList("/vehicles/"+truckId,this.dataTruck,this.error);
        this.dataVehicles = {};
    }

    getVehicles(camion:string){
        this.dataTruck = {};
        this.httputils.onLoadList("/search/vehicles/"+camion,this.dataVehicles,this.error);
    }

    getRechargeTypes(){
        this.httputils.onLoadList("/type/recharges?where=[['op':'ne','field':'enabled','value':false]]",this.rechargeTypes,this.error);
    }
    error=function(err){
        console.log(err);
    }
}



