import { Component, Directive, ElementRef } from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import {RestController} from "../common/restController";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {PermisoSave} from "./methods";
import {RolSave} from "../rol/methods";
import {SELECT_DIRECTIVES} from "ng2-select/ng2-select";
import {globalService} from "../common/globalService";
import {Xeditable, SMDropdown} from "../common/xeditable";


@Component({
    selector: 'permission',
    templateUrl: 'app/permiso/index.html',
    styleUrls: ['app/permiso/style.css'],
    directives:[PermisoSave,Xeditable]
})
export class Permiso extends RestController{

    constructor(public router: Router,public http: Http,public toastr: ToastsManager,public myglobal:globalService) {
        super(http,toastr);
        this.setEndpoint('/permissions/');
    }
    public rules={
        'id': {'type':'text','disabled':true,'display':false,'title':'' },
        'title':{'type':'text','display':null,'title':'Titulo','mode':'inline'},
        'detail':{'type':'textarea','display':null,'title':'Detalle','mode':'inline','showbuttons':true },
        'module':{'type':'text','display':null,'title':'Modulo','mode':'inline' },
    };
    validTokens(){
        if(!localStorage.getItem('bearer'))
        {
            let link = ['AccountLogin', {}];
            this.router.navigate(link);
        }
    }
    ngOnInit(){
        this.validTokens();
        this.max = 30;
        this.loadData();
    }
    assignPermiso(data){
        this.dataList.list.unshift(data);
        this.dataList.list.pop();
    }

}
@Component({
    selector: 'permission-role',
    templateUrl: 'app/permiso/permisosRol.html',
    styleUrls: ['app/permiso/style.css'],
    directives: [SELECT_DIRECTIVES,RolSave,SMDropdown]
})
export class PermisosRol extends RestController {

    constructor(public router: Router,public http: Http,public toastr: ToastsManager,public myglobal:globalService) {
        super(http,toastr);
        this.validTokens();
    }
    ngOnInit(){
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
            this.items=[];
            this.dataRoles.list.forEach(obj=>{
                this.items.push({id:obj.id,text:obj.authority});
            });
        };
        this.httputils.doGet('/roles/',successCallback,this.error)
    }

    //Cargar Rol Seleccionado
    public role:any=[];
    public setRole(value){
        if(value){
            if(this.role.id!=value){
                this.role=[];
                let index = this.dataRoles.list.findIndex(obj => obj.id == value);
                if(index>-1)
                    Object.assign(this.role,this.dataRoles.list[index]);
            }
        }
    }
    //Cargar toda la Lista de permisos
    public dataPermissionsAll:any=[];
    loadPermissions(){
        let successCallback= response => {
            Object.assign(this.dataPermissionsAll, response.json());
            this.findModules();
        };
        this.httputils.doGet('/permissions?sort=module&order=asc&max=1000',successCallback,this.error)
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
    //asignar un nuevo rol
    assignRol(data){
        this.items.unshift({'id':data.id,'text':data.authority});
        this.dataRoles.list.push({'id':data.id,'permissions':[]})
    }
    //Actualizar Permisos
    selectPermission(selectAll){
        this.role.permissions=[];
        if(selectAll){
            this.dataPermissionsAll.list.forEach(obj=>{
                this.role.permissions.push({'id':obj.id});
            });
        }
    }
    //asignar permisos a un rol
    assignPermission(id){
        let index = this.role.permissions.findIndex(obj => obj.id == id);
        if(index > -1)
            this.role.permissions.splice(index,1);
        else
            this.role.permissions.push({'id':id});

    }
    //Guardar Permisos
    savePermissions(){
        let permissions=[];
        this.role.permissions.forEach(obj=>{
            permissions.push(obj.id);
        });
        let body = JSON.stringify({'permissions':permissions});
        let successCallback= response => {
            let index = this.dataRoles.list.findIndex(obj => obj.id == this.role.id);
            this.dataRoles.list[index].permissions = this.role.permissions;
            this.toastr.success('Guardado con éxito')
        }
        this.httputils.doPost('/role/'+this.role.id+'/permissions/',body,successCallback,this.error)
    }
    //Cargar mis permisos
    loadMyPermissions(){
        this.myglobal.myPermissions();
    }

}