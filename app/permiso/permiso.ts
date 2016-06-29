import { Component } from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import {RestController} from "../common/restController";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {PermisoSave} from "./methods";
import {SELECT_DIRECTIVES} from "ng2-select/ng2-select";

@Component({
    selector: 'permission',
    templateUrl: 'app/permiso/index.html',
    styleUrls: ['app/permiso/style.css'],
    directives:[PermisoSave]
})
export class Permiso extends RestController{

    constructor(public router: Router,public http: Http,public toastr: ToastsManager) {
        super(http,toastr);
        this.validTokens();
        this.setEndpoint('/permissions/');
        this.loadData();
    }
    validTokens(){
        if(!localStorage.getItem('bearer'))
        {
            let link = ['AccountLogin', {}];
            this.router.navigate(link);
        }
    }
    assignPermiso(data){
        this.dataList.list.unshift(data);
    }

}

@Component({
    selector: 'permission-role',
    templateUrl: 'app/permiso/permisosRol.html',
    styleUrls: ['app/permiso/style.css'],
    directives: [SELECT_DIRECTIVES]
})
export class PermisosRol extends RestController{

    constructor(public router: Router,public http: Http,public toastr: ToastsManager) {
        super(http,toastr);
        this.validTokens();
        this.loadPermissions();
        this.loadRoles();
    }
    validTokens(){
        if(!localStorage.getItem('bearer'))
        {
            let link = ['AccountLogin', {}];
            this.router.navigate(link);
        }
    }
    //Cargar Roles
    public items:any = [];
    public dataRoles:any=[];
    loadRoles(){
        let successCallback= response => {
            Object.assign(this.dataRoles, response.json());
            this.dataRoles.list.forEach(obj=>{
                this.items.push({id:obj.id,text:obj.authority});
            });
        };
        this.httputils.doGet('/roles/',successCallback,this.error)
    }
    //Cargar Rol Seleccionado
    public role:any=[];
    public refreshValue(value:any):void {
        this.role=[];
        if (value.id)
        {
            let index = this.dataRoles.list.findIndex(obj => obj.id == value.id);
            if(index>-1)
                Object.assign(this.role,this.dataRoles.list[index]);
        }
    }
    //Cargar toda la Lista de permisos
    public dataPermissionsAll:any=[];
    loadPermissions(){
        let successCallback= response => {
            Object.assign(this.dataPermissionsAll, response.json());
            this.findModules();
        };
        this.httputils.doGet('/permissions?sort=module&order=asc',successCallback,this.error)
    }
    //Consultar Permisos de un rol
    public dataPermissionsRole:any=[];
    public loadPermissionsRol(id){
        let successCallback= response => {
            Object.assign(this.dataPermissionsRole, response.json());
        };
        this.httputils.doGet('/role/'+id+'/permissions',successCallback,this.error)
    }
    //Verificar Existencia del permiso
    public existsPermission(id){
        let index = this.role.permissions.findIndex(obj => obj.id == id);
        if(index > -1)
            return true;
        return false;
    }
    //List Modules
    public modules:any=[];
    public findModules(){
        this.dataPermissionsAll.list.forEach(obj=>{
            if(this.modules.indexOf(obj.module)<0)
                this.modules.push(obj.module);
        });
    }



}