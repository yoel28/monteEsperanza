import { Http} from '@angular/http';
import { Router }           from '@angular/router-deprecated';
import  {FormBuilder, Validators, Control, ControlGroup,} from '@angular/common';
import {HttpUtils} from "./http-utils";

export class RestController{
    dataList:any = [];
    httputils:HttpUtils;
    endpoint:string;
    form: ControlGroup;

    constructor(public http: Http) {
        this.httputils = new HttpUtils(http);
    }
    setEndpoint(endpoint:string){
        this.endpoint=endpoint;
    }
    setForm(form:ControlGroup){
        this.form =form;
    }
    error(err){
        console.log(err);
    }
    
    loadData(){
        event.preventDefault();
        this.httputils.onLoadList(this.endpoint,this.dataList,this.error);
    };
    onUpdate(event,data){
        event.preventDefault();
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
    onSave(event: Event) {
        event.preventDefault();
        let body = JSON.stringify(this.form.value);
        this.httputils.onSave(this.endpoint,body,this.dataList,this.error);
    }
}
