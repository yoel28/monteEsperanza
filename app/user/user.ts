import { Component } from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http} from '@angular/http';

import { HttpUtils } from '../common/http-utils';

@Component({
    selector: 'user',
    templateUrl: 'app/user/user.html',
    styleUrls: ['app/user/user.css']
})

export class RestController{
    user:any = [];
    httputils:HttpUtils;
    endpoint:string;

    constructor(private router: Router,public http: Http) {
        this.httputils = new HttpUtils(this.http);
    }
    setEndpoint(end){
        this.endpoint=end;
    }

    error=function(err){
        console.log(err);
    }

    getUser(){
        this.httputils.onLoadList(this.endpoint, this.user, this.error);
    }

    onDelete(event,id){
        event.preventDefault();
        this.httputils.onDelete(this.endpoint+id, id, this.user, this.error);
    }
    onUpdate(event,data){
        event.preventDefault();
        if(data[event.target.id]!=event.target.innerHTML){
            data[event.target.id] = event.target.innerHTML;
            let body = JSON.stringify(data);
            this.httputils.onUpdate(this.endpoint+data.id,body,this.user,this.error);
        }
    }
    onSave(event, username, password,email,phone,name) {
        event.preventDefault();
        let body = JSON.stringify({username, password,email,phone,name});
        this.httputils.onSave(this.endpoint,body,this.user,this.error);
    }
}
export class User extends  RestController{

    constructor( router: Router, http: Http) {
        if(!localStorage.getItem('bearer'))
        {
            let link = ['AccountLogin', {}];
            router.navigate(link);
        }
        super(router,http);
        this.setEndpoint("/users/");
        this.getUser();
    }
}