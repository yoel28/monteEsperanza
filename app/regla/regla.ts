import { Component } from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import {RestController} from "../common/restController";
import {ReglaSave} from "./methods";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {globalService} from "../common/globalService";
import {Xeditable} from "../common/xeditable";
import {Filter} from "../utils/filter/filter";

@Component({
    selector: 'regla',
    templateUrl: 'app/regla/index.html',
    styleUrls: ['app/regla/style.css'],
    directives : [ReglaSave,Xeditable,Filter]
})
export class Regla extends RestController{
    public dataSelect:any={};
    public rules={
        'rule':{'type':'text','display':null,'title':'Regla','placeholder':'Regla','search':true},
        'name':{'type':'text','display':null,'title':'Nombre','placeholder':'Nombre','search':true},
    };

    constructor(public router: Router,public http: Http,toastr:ToastsManager,public myglobal:globalService) {
        super(http,toastr);
        this.setEndpoint('/rules/');
    }
    ngOnInit(){
        if (this.myglobal.existsPermission('53')) {
            this.loadData();
        }
    }
    assignRule(data){
        this.dataList.list.unshift(data);
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