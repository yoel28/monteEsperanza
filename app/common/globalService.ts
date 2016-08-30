import { Injectable } from '@angular/core';
import {RestController} from "./restController";
import {Http} from "@angular/http";
import {contentHeaders} from "./headers";
import {ToastsManager} from "ng2-toastr/ng2-toastr";

@Injectable()
export class globalService extends RestController{
    version:string = "1.0.0";
    user:any=[];
    params:any={};
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
            this.loadParams();
            this.getUser();
        }
    }
    getUser(){
        let that=this;
        let error= response => {
            that.toastr.error('Tu Sesión Expiró','Ocurrió un error');
            localStorage.removeItem('bearer');
            contentHeaders.delete('Authorization');
            window.location.reload();
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
        return true;
    }
    myPermissions(){
        let that = this;
        let successCallback= response => {
            Object.assign(that.permissions,response.json());
            that.init=true;
        };
        return this.httputils.doGet('/current/permissions/',successCallback,this.error);
    }
    loadParams(){
        let that = this;
        let successCallback= response => {
            Object.assign(that.params,response.json().list);
        };
        this.httputils.doGet('/params?max=100',successCallback,this.error);
    }
    getParams(key){
        let that = this;
        let valor="";
        Object.keys(this.params).forEach(index=>{
            if(that.params[index].key==key){
                valor=that.params[index].value;
                return;
            }
        })
        return valor;
    }
    
}