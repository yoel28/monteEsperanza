import {Component, OnInit} from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import {RestController} from "../common/restController";
import {ReglaSave} from "./methods";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {globalService} from "../common/globalService";
import {Xeditable} from "../common/xeditable";
import {Filter} from "../utils/filter/filter";
declare var SystemJS:any;

@Component({
    selector: 'regla',
    templateUrl: SystemJS.map.app+'/regla/index.html',
    styleUrls: [SystemJS.map.app+'/regla/style.css'],
    directives : [ReglaSave,Xeditable,Filter]
})
export class Regla extends RestController implements OnInit{
    public dataSelect:any={};
    public rules={
        'rule':{'type':'text','display':null,'title':'Regla','placeholder':'Regla','search':true},
        'name':{'type':'text','display':null,'title':'Nombre','placeholder':'Nombre','search':true},
        'detail':{
            'type':'textarea',
            'key':'detail',
            'icon':'fa fa-list',
            'required':true,
            'display':null,
            'title':'Detalle',
            'mode':'inline',
            'placeholder': 'Detalle',
            'showbuttons':true,
            'search': true,
            'msg':{
                'error':'El detalle contiene errores',
            }
        },
    };

    constructor(public router: Router,public http: Http,toastr:ToastsManager,public myglobal:globalService) {
        super(http,toastr);
        this.setEndpoint('/rules/');
    }
    ngOnInit(){

    }
    public modalIn:boolean=true;
    loadPage(){
        this.modalIn=false;
        if (this.myglobal.existsPermission('53')) {
            this.loadData();
        }
    }
    onDashboard(){
        let link = ['Dashboard', {}];
        this.router.navigate(link);
    }
    assignRule(data){
        this.dataList.list.unshift(data);
        if(this.dataList.page.length > 1)
            this.dataList.list.pop();
    }
    //Cargar Where del filter
    public paramsFilter:any = {
        title: "Filtrar Reglas",
        idModal: "modalFilter",
        endpointForm: "",
    };

    loadWhere(where) {
        this.where = where;
        this.loadData();
    }

}