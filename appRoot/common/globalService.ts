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
    help:any={};
    rules:any={};
    permissions:any=[];
    allPermissions:any={};
    init=false;

    status={
        'token':{'status':false,'title':'Validando usuario'},
        'user':{'status':false,'title':'Consultando datos del usuario'},
        'permissions':{'status':false,'title':'Consultando  permisos'},
        'params':{'status':false,'title':'Consultando  parametros'},
        'help':{'status':false,'title':'Consultando  ayudas'},
        'rules':{'status':false,'title':'Consultando  reglas'},
    };

    objectInstance:any={};//lista de instancias creadas
    
    constructor(public http:Http,public toastr: ToastsManager) {
        super(http,toastr);

        if (typeof(Storage) !== "undefined") {
            console.log("habemus localstorage")
        } else {
            console.log("no habemus localstorage")
        }

        if(localStorage.getItem('bearer')){
            this.initSession();
        }
    }
    initSession(){
        this.initFinish(true);
        this.loadValidToken();
        this.loadMyPermissions();
        this.loadParams();
        this.loadTooltips();
        this.loadRules();
    }
    initFinish(reverse=false){
        if(reverse)
        {
            this.status.token.status=false;
            this.status.user.status=false;
            this.status.permissions.status=false;
            this.status.params.status=false;
            this.status.help.status=false;
            this.status.rules.status=false;
        }
        if(this.status.token.status && this.status.user.status  && this.status.permissions.status && this.status.params.status && this.status.help.status && this.status.rules.status)
            this.init=true;
    }
    countInitSession(){
        let count=1;
        let that=this;
        Object.keys(this.status).forEach(key=>{
            if(!that.status[key].status)
                count++;
        })
        console.log(100/count)
        return (100/count);

    }
    error = err => {
        if(localStorage.getItem('bearer')){
            this.initFinish(true);
            this.toastr.error('Tu Sesión Expiró','Ocurrió un error');
            localStorage.removeItem('bearer');
            contentHeaders.delete('Authorization');
            window.location.reload();
        }
    }
    loadValidToken(){
        let that=this;
        let successCallback= response => {
            Object.assign(that.user, response.json());
            that.status.token.status=true;
            that.initFinish();
            that.loadUser();
        };
        this.httputils.doGet('/validate',successCallback,this.error);
    }
    loadUser(){
        let that = this;
        let successCallback= response => {
            Object.assign(that.user,that.user,response.json().list[0]);
            that.status.user.status=true;
            that.initFinish();
        };
        let where = encodeURI('[["op":"eq","field":"username","value":"'+this.user.username+'"]]');
        this.httputils.doGet('/users?where='+where, successCallback,this.error);
    };
    loadMyPermissions(){
        let that = this;
        let successCallback= response => {
            Object.assign(that.permissions,response.json());
            that.status.permissions.status=true;
            that.initFinish();
        };
        return this.httputils.doGet('/current/permissions/',successCallback,this.error);
    }
    loadParams(){
        let that = this;
        let successCallback= response => {
            Object.assign(that.params,response.json().list);
            that.status.params.status=true;
            that.initFinish();
        };
        this.httputils.doGet('/params?max=1000',successCallback,this.error);
    }
    loadRules(){
        let that = this;
        let successCallback= response => {
            Object.assign(that.rules,response.json().list);
            that.status.rules.status=true;
            that.initFinish();
        };
        this.httputils.doGet('/rules?max=1000',successCallback,this.error);
    }
    loadTooltips(){
        let that = this;
        let successCallback= response => {
            Object.assign(that.help,response.json().list);
            that.status.help.status=true;
            that.initFinish();
        };
        this.httputils.doGet('/infos?max=1000',successCallback,this.error);
    }
    existsPermission(val){
        let index = this.permissions.findIndex(obj => (obj.id == val || obj.code == val));
        if(index > -1)
            return true;
        return false;
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

    getRule(key){
        let that = this;
        let valor="";
        Object.keys(this.rules).forEach(index=>{
            if(that.rules[index].key==key){
                valor=that.rules[index].value;
                return;
            }
        })
        return valor;
    }
    getTooltip(code){
        let that = this;
        let valor={};
        Object.keys(this.help).forEach(index=>{
            if(that.help[index].code==code){
                valor=that.help[index];
                return;
            }
        })
        return valor;
    }
    getKeys(data){
        return Object.keys(data);
    }
    
}