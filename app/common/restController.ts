import { Router }           from '@angular/router-deprecated';
import { Http} from '@angular/http';
import {HttpUtils} from "./http-utils";

export class RestController{
    data:any = [];
    httputils:HttpUtils;
    endpoint:string;

    constructor(public router: Router,public http: Http) {
        this.httputils = new HttpUtils(this.http);
    }
    setEndpoint(end){
        this.endpoint=end;
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
        this.httputils.onSave(this.endpoint,body,this.data,this.error);
    }
}
