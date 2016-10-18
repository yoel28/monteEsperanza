import {Component, Directive, ElementRef, OnInit} from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import {RestController} from "../common/restController";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {PermisoSave} from "./methods";
import {RolSave} from "../rol/methods";
import {SELECT_DIRECTIVES} from "ng2-select/ng2-select";
import {globalService} from "../common/globalService";
import {Xeditable, SMDropdown} from "../common/xeditable";
import {Filter} from "../utils/filter/filter";
declare var SystemJS:any;

@Component({
    selector: 'permission',
    templateUrl: SystemJS.map.app+'/permiso/index.html',
    styleUrls: [SystemJS.map.app+'/permiso/style.css'],
    directives:[PermisoSave,Xeditable,Filter]
})
export class Permiso extends RestController implements OnInit{

    public dataSelect:any={};

    constructor(public router: Router,public http: Http,public toastr: ToastsManager,public myglobal:globalService) {
        super(http,toastr);
        this.setEndpoint('/permissions/');
    }
    public rules={
        'title':{'type':'text','display':null,'title':'Titulo','mode':'inline','placeholder': 'Titulo', 'search': true},
        'detail':{'type':'textarea','display':null,'title':'Detalle','mode':'inline','showbuttons':true,'placeholder': 'Detalle', 'search': true},
        'module':{'type':'text','display':null,'title':'Modulo','mode':'inline','placeholder': 'Modulo', 'search': true},
        'controlador':{'type':'text','display':null,'title':'Modulo','mode':'inline','placeholder': 'Controlador', 'search': true},
        'accion':{'type':'text','display':null,'title':'Modulo','mode':'inline','placeholder': 'Accion', 'search': true},
        'code':{'type':'text','display':null,'title':'Codigo','mode':'inline','placeholder': 'Codigo', 'search': true},
    };
    public modalIn:boolean=true;
    ngOnInit(){

    }
    loadPage(){
        this.modalIn=false;
        if(this.myglobal.existsPermission('41')){
            this.max = 30;
            this.loadData();
        }
    }
    onDashboard(){
        let link = ['Dashboard', {}];
        this.router.navigate(link);
    }
    assignPermiso(data){
        this.dataList.list.unshift(data);
        if(this.dataList.page.length > 1)
            this.dataList.list.pop();
    }
    public paramsFilter:any = {
        title: "Filtrar permisos",
        idModal: "modalFilter",
        endpoint: "",
    };
    loadWhere(where) {
        this.where = where;
        this.loadData();
    }


}
@Component({
    selector: 'permission-role',
    templateUrl: SystemJS.map.app+'/permiso/permisosRol.html',
    styleUrls: [SystemJS.map.app+'/permiso/style.css'],
    directives: [SELECT_DIRECTIVES,RolSave,SMDropdown]
})
export class PermisosRol extends RestController implements OnInit{

    public dataSelect:any={};

    constructor(public router: Router,public http: Http,public toastr: ToastsManager,public myglobal:globalService) {
        super(http,toastr);
    }
    ngOnInit(){

    }
    //advertencia
    public modalIn:boolean=true;
    loadPage(event){
        event.preventDefault();
        this.modalIn=false;
        this.loadPermissions();
        if(this.myglobal.existsPermission('48'))
            this.loadRoles();
    }
    onDashboard(event){
        event.preventDefault();
        let link = ['Dashboard', {}];
        this.router.navigate(link);
    }


    //Cargar Roles
    public items:any = [];
    public dataRoles:any=[];
    loadRoles(){
        if(this.myglobal.existsPermission('48')){
            let successCallback= response => {
                Object.assign(this.dataRoles, response.json());
                this.items=[];
                this.dataRoles.list.forEach(obj=>{
                    this.items.push({id:obj.id,text:obj.authority});
                });
            };
            this.httputils.doGet('/roles/',successCallback,this.error)
        }
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
        this.myglobal.loadMyPermissions();
    }

}