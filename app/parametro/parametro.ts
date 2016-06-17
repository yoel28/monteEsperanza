import { Component } from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import  {FormBuilder, Validators, Control, ControlGroup,} from '@angular/common';
import {HttpUtils} from "../common/http-utils";

@Component({
    selector: 'parametro',
    templateUrl: 'app/parametro/parametro.html',
    styleUrls: ['app/parametro/parametro.css']
})
export class Parametro {
    dataList:any=[];
    httputils:HttpUtils;
    endpoint:string;


    constructor(public router: Router,public http: Http, _formBuilder: FormBuilder) {
        if(!localStorage.getItem('bearer'))
        {
            let link = ['AccountLogin', {}];
            this.router.navigate(link);
        }
        this.endpoint="/params/";
        this.httputils = new HttpUtils(http);
        this.loadData();

        this.key = new Control("", Validators.compose([Validators.required]));
        this.value = new Control("", Validators.compose([Validators.required]));
        this.type = new Control("", Validators.compose([Validators.required]));


        this.form = _formBuilder.group({
            key: this.key,
            value: this.value,
            type: this.type,
        });
    }
    error=function(err){
        console.log(err);
    }

    loadData(){
        event.preventDefault();
        this.httputils.onLoadList(this.endpoint,this.dataList,this.error);
    }
    onUpdate(event,data){
        //event.preventDefault();
        if(data[event.target.accessKey]!=event.target.innerHTML){
            data[event.target.accessKey] = event.target.innerHTML;
            let body = JSON.stringify(data);
            this.httputils.onUpdate(this.endpoint+data.id,body,this.dataList,this.error);
        }
    }
    onDelete(event,id){
        event.preventDefault();
        this.httputils.onDelete(this.endpoint+id, id, this.dataList, this.error);
    }

    form: ControlGroup;
    key: Control;
    value: Control;
    type: Control;

    onSave(event: Event) {
        event.preventDefault();
        let body = JSON.stringify(this.form.value);
        this.httputils.onSave(this.endpoint,body,this.dataList,this.error);
    }
}