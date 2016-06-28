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
    
    constructor(public http:Http,public toastr: ToastsManager) {
        super(http,toastr);
        if(localStorage.getItem('bearer')){
            this.getUser();
        }
    }
    getUser(){
        let error= response => {
            this.toastr.error('Tu Sesion Expiro','Ocurrio un error');
            localStorage.removeItem('bearer');
            contentHeaders.delete('Authorization');
        };

        let successCallback= response => {
            Object.assign(this.user, response.json());
            let successCallback2= response => {
                Object.assign(this.user,this.user,response.json().list[0]);
                let successCallback3= response => {
                    Object.assign(this.permissions,response.json());
                    localStorage.setItem('permissions',response.json());
                };
                this.httputils.doGet('/current/permissions/',successCallback3,error);
            };
            this.httputils.doGet('/users?where=[["op":"eq","field":"username","value":"'+this.user.username+'"]]', successCallback2,error);
        };
        this.httputils.doGet('/validate',successCallback,error);
    }
    
}