import { Injectable } from '@angular/core';
import {RestController} from "./restController";
import {Http} from "@angular/http";

@Injectable()
export class globalService extends RestController{
    version:string = "1.0.0";
    user:any=[];
    
    constructor(public http:Http){
        super(http);
        if(localStorage.getItem('bearer')){
            this.getUser();
        }
    }
    getUser(){
        let successCallback= response => {
             Object.assign(this.user, response.json());
            let successCallback2= response => {
                Object.assign(this.user,this.user,response.json().list[0]);
            }
            this.httputils.doGet(
                '/users?where=[["op":"eq","field":"username","value":"'+this.user.username+'"]]',
                successCallback2,error);
        }
        let error= response => {

        }
        this.httputils.doGet('/validate',successCallback,error);
        

    }
    
}