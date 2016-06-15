import { Component } from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import  {FormBuilder, Validators, Control, ControlGroup,} from '@angular/common';
import { Http } from '@angular/http';
import {HttpUtils} from "../common/http-utils";


@Component({
    selector: 'taquilla',
    templateUrl: 'app/taquilla/taquilla.html',
    styleUrls: ['app/taquilla/taquilla.css']
})
export class Taquilla {
    dataCamion:any = {};
    httputils:HttpUtils;
    endpoint:string;

    form: ControlGroup;
    quantify: Control;
    reference: Control;
    referenceDate: Control;
    vehiculo: Control;


    constructor(router: Router,http: Http,_formBuilder: FormBuilder) {
        if(!localStorage.getItem('bearer'))
        {
            let link = ['AccountLogin', {}];
            router.navigate(link);
        }
        //TODO Enpoint Real
        this.endpoint="/users/";
        this.httputils = new HttpUtils(http);

        this.quantify = new Control("", Validators.compose([Validators.required]));
        this.reference = new Control("", Validators.compose([Validators.required]));
        this.referenceDate = new Control("", Validators.compose([Validators.required]));

        this.form = _formBuilder.group({
            quantify: this.quantify,
            reference: this.reference,
            referenceDate: this.referenceDate,
        });
    }
    getRecarga(event: Event) {

        let json = Object.assign({"vehicle": {id: this.dataCamion.id}},this.form.value);
        let body = JSON.stringify(json);
        
        //TODO: this.httputils.onSave("/recarga/",body,this.dataCamion,this.error);
        this.dataCamion.recargas.push(json);
    }
    getCamion(camion:string){
        //TODO Consulta Real
        //this.httputils.onLoadList("/camion/"+camion,this.data,this.error);
        this.httputils.onLoadList("consultas/DetalleCamion.json",this.dataCamion,this.error,true);
        console.log("Peticion GetCamion "+camion);
    }
    error=function(err){
        console.log(err);
    }
}



