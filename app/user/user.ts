import { Component } from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http} from '@angular/http';
import {HttpUtils} from "../common/http-utils";

@Component({
    selector: 'user',
    templateUrl: 'app/user/user.html',
    styleUrls: [
        'app/user/user.css'
    ],

})
export class User{
    data:any = [];
    httputils:HttpUtils;
    endpoint:string;

    constructor(public router: Router, http: Http) {
        if(!localStorage.getItem('bearer'))
        {
            let link = ['AccountLogin', {}];
            router.navigate(link);
        }
        this.endpoint="/users/";
        this.httputils = new HttpUtils(http);
        this.getLoad();
    }

    error=function(err){
        console.log(err);
    }

    getLoad(){
        this.httputils.onLoadList(this.endpoint, this.data, this.error);
    }

    onDelete(event,id){
        event.preventDefault();
        this.httputils.onDelete(this.endpoint+id, id, this.data, this.error);
    }
    onUpdate(event,data){
        event.preventDefault();
        if(data[event.target.id]!=event.target.innerHTML){
            data[event.target.id] = event.target.innerHTML;
            let body = JSON.stringify(data);
            this.httputils.onUpdate(this.endpoint+data.id,body,this.data,this.error);
        }
    }
    onSave(event, username, password,email,phone,name) {
        event.preventDefault();
        let body = JSON.stringify({username, password,email,phone,name});
        this.httputils.onSave(this.endpoint,body,this.data.list,this.error);
    }
    goTaquilla(companyRuc:string)
    {
        let link = ['TaquillaSearh', {search:companyRuc}];
        this.router.navigate(link);
    }
    onPatch(field,data,value?){
        let json = {}
        if(value)
            json[field] = value;
        else
            json[field] = !data[field];

        let body = JSON.stringify(json);

        this.httputils.onUpdate(this.endpoint+data.id,body, data,this.error);

        
    }

}