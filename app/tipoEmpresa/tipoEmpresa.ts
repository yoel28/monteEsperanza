import { Component } from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import  {FormBuilder, Validators, Control, ControlGroup,} from '@angular/common';
import {HttpUtils} from "../common/http-utils";

//--------------------------LOGIN-------------------------------
@Component({
    selector: 'tipoEmpresa',
    templateUrl: 'app/tipoEmpresa/tipoEmpresa.html',
    styleUrls: ['app/tipoEmpresa/tipoEmpresa.css']
})
export class TipoEmpresa {
    tipoEmpresa:any=[];
    httputils:HttpUtils;
    endpoint:string;


    constructor(public router: Router,public http: Http, _formBuilder: FormBuilder) {
        if(!localStorage.getItem('bearer'))
        {
            let link = ['AccountLogin', {}];
            this.router.navigate(link);
        }
        this.endpoint="/type/companies/";
        this.httputils = new HttpUtils(http);
        this.getTipoEmpresas();

        this.title = new Control("", Validators.compose([Validators.required]));
        this.icon = new Control("", Validators.compose([Validators.required]));
        this.form = _formBuilder.group({
            title: this.title,
            icon: this.icon,
        });
    }
    error=function(err){
        console.log(err);
    }

    getTipoEmpresas(){
        event.preventDefault();
        this.httputils.onLoadList(this.endpoint,this.tipoEmpresa,this.error);
    }
    onUpdate(event,data){
        //event.preventDefault();
        if(data[event.target.accessKey]!=event.target.innerHTML){
            data[event.target.accessKey] = event.target.innerHTML;
            let body = JSON.stringify(data);
            this.httputils.onUpdate(this.endpoint+data.id,body,data,this.error);
        }
    }
    onDelete(event,id){
        event.preventDefault();
        this.httputils.onDelete(this.endpoint+id, id, this.tipoEmpresa, this.error);
    }

    form: ControlGroup;
    title: Control;
    icon: Control;

    onSave(event: Event) {
        event.preventDefault();
        let body = JSON.stringify(this.form.value);
        this.httputils.onSave(this.endpoint,body,this.tipoEmpresa,this.error);
    }
}