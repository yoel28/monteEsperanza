import { Injectable } from '@angular/core';
import {RestController} from "./restController";
import {Http} from "@angular/http";
import {contentHeaders} from "./headers";
import {ToastsManager} from "ng2-toastr/ng2-toastr";

@Injectable()
export class globalService extends RestController{
    version:string = "1.0.0";
    user:any=[];
    permissions:any=[];
    init=false;
    
    constructor(public http:Http,public toastr: ToastsManager) {
        super(http,toastr);

        if (typeof(Storage) !== "undefined") {
            console.log("habemus localstorage")
        } else {
            console.log("no habemus localstorage")
        }

        if(localStorage.getItem('bearer')){
            this.getUser();
        }
    }
    getUser(){
        let that=this;
        let error= response => {
            that.toastr.error('Tu Sesión Expiró','Ocurrió un error');
            localStorage.removeItem('bearer');
            contentHeaders.delete('Authorization');
            window.location = <any>"http://vertedero.aguaseo.com";
        };

        let successCallback= response => {
            Object.assign(that.user, response.json());
            let successCallback2= response => {
                Object.assign(that.user,that.user,response.json().list[0]);
                that.myPermissions();
            };
            let where = encodeURI('[["op":"eq","field":"username","value":"'+this.user.username+'"]]');
            this.httputils.doGet('/users?where='+where, successCallback2,error);
        };
        this.httputils.doGet('/validate',successCallback,error);
    }
    existsPermission(id){
        let index = this.permissions.findIndex(obj => obj.id == id);
        if(index > -1)
            return true;
        return false;
    }
    myPermissions(){
        let that = this;
        let successCallback= response => {
            Object.assign(that.permissions,response.json());
            that.init=true;
        };
        return this.httputils.doGet('/current/permissions/',successCallback,this.error);
    }
    
}