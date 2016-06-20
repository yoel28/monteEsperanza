import { Http} from '@angular/http';
import  {ControlGroup,} from '@angular/common';
import {HttpUtils} from "./http-utils";

export class RestController{

    dataList:any = [];
    httputils:HttpUtils;
    endpoint:string;

    constructor(public http: Http) {
        this.httputils = new HttpUtils(http);
    }
    setEndpoint(endpoint:string){
        this.endpoint=endpoint;
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
    onSave(data:ControlGroup){
        let body = JSON.stringify(data.value);
        this.httputils.onSave(this.endpoint,body,this.dataList,this.error);
    }
    onPatch(field,data,value?){
        event.preventDefault();
        let json = {};
        json[field] = value?value:!data[field];
        let body = JSON.stringify(json);
        this.httputils.onUpdate(this.endpoint+data.id,body, data,this.error);
    }
}
