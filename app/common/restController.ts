import { Http} from '@angular/http';
import  {ControlGroup,} from '@angular/common';
import {HttpUtils} from "./http-utils";
import {ToastsManager} from "ng2-toastr/ng2-toastr";


export class RestController{

    dataList:any = [];
    httputils:HttpUtils;
    endpoint:string;
    offset=0;
    max=5;
    page:any=[];

    constructor(public http: Http,public toastr?: ToastsManager) {
        this.httputils = new HttpUtils(http);
    }
    setEndpoint(endpoint:string){
        this.endpoint=endpoint;
    }
    error(err){
        if(this.toastr)
            this.toastr.error(err);
        console.log(err);
    }

    loadData(offset=0){
        this.offset=offset;
        this.httputils.onLoadList(this.endpoint+"?max="+this.max+"&offset="+this.offset,this.dataList,this.max,this.error);
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
        this.httputils.onDelete(this.endpoint+id, id, this.dataList.list, this.error);
    }
    onSave(data:ControlGroup){
        let body = JSON.stringify(data.value);
        this.httputils.onSave(this.endpoint,body,this.dataList.list,this.error);
    }
    onPatch(field,data,value?){
        let json = {};
        json[field] = value?value:!data[field];
        let body = JSON.stringify(json);
        this.httputils.onUpdate(this.endpoint+data.id,body, data,this.error);
    }
}
