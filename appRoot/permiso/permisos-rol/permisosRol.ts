import {Component, OnInit} from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import {RestController} from "../../common/restController";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {globalService} from "../../common/globalService";
import {SMDropdown} from "../../common/xeditable";

declare var SystemJS:any;
@Component({
    selector: 'permission-role',
    templateUrl: SystemJS.map.app+'/permiso/permisos-rol/index.html',
    styleUrls: [SystemJS.map.app+'/permiso/style.css'],
    directives: [SMDropdown]
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
        this.loadRoles();
    }
    onDashboard(event){
        event.preventDefault();
        let link = ['Dashboard', {}];
        this.router.navigate(link);
    }

    public dataPermissionsAll:any={};
    loadPermissions(){
        let that=this;
        let successCallback= response => {
            that.permissionsOrder(response.json());
        };
        this.httputils.doGet('/permissions?max=1000',successCallback,this.error)
    }
    permissionsOrder(data){
        let that=this;
        data.list.forEach(obj=>{
            if(!that.dataPermissionsAll[obj.module])
            {
                that.dataPermissionsAll[obj.module]=[];
            }
            that.dataPermissionsAll[obj.module].push(obj);
        });
    }

    //Cargar Roles
    public items:any = [];
    public dataRoles:any=[];
    loadRoles(){
        if(this.myglobal.existsPermission(['ROLE_LIST'])){
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

    public existsPermission(id){
        let index = this.role.permissions.findIndex(obj => obj.id == id);
        if(index > -1)
            return true;
        return false;
    }

    getObjectKeys(data={}){
        return Object.keys(data);
    }


    //Actualizar Permisos
    selectPermission(selectAll){
        let that=this;
        that.role.permissions=[];
        if(selectAll){
            Object.keys(this.dataPermissionsAll).forEach(module=>{
                that.dataPermissionsAll[module].forEach(data=>{
                    that.role.permissions.push({'id':data.id});
                });
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

    existAllPermissionsModule(module):boolean{
        let that=this;
        let assignAll=true;
        this.dataPermissionsAll[module].forEach(data =>{
            let index = that.role.permissions.findIndex(obj => obj.id == data.id);
            if(index < 0)
                return assignAll=false;
        });
        return assignAll;
    }
    assignPermissionModule(module,assign){
        let that=this;
        this.dataPermissionsAll[module].forEach(data =>{
            let index = that.role.permissions.findIndex(obj => obj.id == data.id);
            if(index < 0 && assign)
                this.role.permissions.push({'id':data.id});
            else if (index > -1 && !assign)
                this.role.permissions.splice(index,1);
        });
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


}
