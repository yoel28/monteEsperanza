import { Component } from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import  {FormBuilder, Validators, Control, ControlGroup,} from '@angular/common';
import {HttpUtils} from "../common/http-utils";

@Component({
    selector: 'tagRfid',
    templateUrl: 'app/tagRfid/tagRfid.html',
    styleUrls: ['app/tagRfid/tagRfid.css']
})
export class TagRfid {
    dataList:any=[];
    httputils:HttpUtils;
    endpoint:string;


    constructor(public router: Router,public http: Http, _formBuilder: FormBuilder) {
        if(!localStorage.getItem('bearer'))
        {
            let link = ['AccountLogin', {}];
            this.router.navigate(link);
        }
        this.endpoint="/rfids/";
        this.httputils = new HttpUtils(http);
        this.loadData();

        this.vehicle = new Control("", Validators.compose([Validators.required]));
        this.number = new Control("", Validators.compose([Validators.required]));


        this.form = _formBuilder.group({
            vehicle: this.vehicle,
            number: this.number,
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
    vehicle: Control;
    number: Control;

    onSave(event: Event) {
        event.preventDefault();
        let body = JSON.stringify(this.form.value);
        this.httputils.onSave(this.endpoint,body,this.dataList,this.error);
    }
}