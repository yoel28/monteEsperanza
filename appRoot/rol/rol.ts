import {Component, OnInit} from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import {RestController} from "../common/restController";
import {RolSave} from "./methods";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {globalService} from "../common/globalService";
import {Xeditable} from "../common/xeditable";
import {Filter} from "../utils/filter/filter";
declare var SystemJS:any;

@Component({
    selector: 'rol',
    templateUrl: SystemJS.map.app+'/rol/index.html',
    styleUrls: [SystemJS.map.app+'/rol/style.css'],
    directives:[RolSave,Xeditable,Filter]
})
export class Rol extends RestController implements OnInit{

    public rules={
        'authority':{'type':'text','display':null,'title':'Titulo','placeholder':'Nombre del perfil','search':true},
    }
    constructor(public router: Router,public http: Http,toastr:ToastsManager,public myglobal:globalService) {
        super(http,toastr);
        this.setEndpoint('/roles/');
    }
    //advertencia
    public modalIn:boolean=true;
    loadPage(event){
        event.preventDefault();
        this.modalIn=false;
        if (this.myglobal.existsPermission('48')) {
            this.loadData();
        }
    }
    onDashboard(event){
        event.preventDefault();
        let link = ['Dashboard', {}];
        this.router.navigate(link);
    }

    ngOnInit(){

    }
    assignRol(data){
        this.dataList.list.unshift(data);
        if(this.dataList.page.length > 1)
            this.dataList.list.pop();
    }
    //Cargar Where del filter
    public paramsFilter:any = {
        title: "Filtrar roles",
        idModal: "modalFilter",
        endpoint: "",
    };

    loadWhere(where) {
        this.where = where;
        if (this.myglobal.existsPermission('48')) {
            this.loadData();
        }
    }

}