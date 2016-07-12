import { Component } from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import {RestController} from "../common/restController";
import  {OperacionSave} from "./methods";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {Xeditable} from "../common/xeditable";
import {globalService} from "../common/globalService";
import {Filter} from "../utils/filter/filter";

@Component({
    selector: 'operacion',
    templateUrl: 'app/operacion/index.html',
    styleUrls: ['app/operacion/style.css'],
    directives:[OperacionSave,Xeditable,Filter]
})
export class Operacion extends RestController{

    constructor(public router: Router,public http: Http,public toastr: ToastsManager, public myglobal:globalService) {
        super(http,toastr);
        this.setEndpoint('/operations/');
    }
    ngOnInit(){
        if (this.myglobal.existsPermission('93')) {
            this.max = 15;
            this.loadData();
        }
    }

    public rules={
        'id': {'type':'number','disabled':true,'display':false,'title':'','search': true,'placeholder': 'Identificador',},
        'weightIn':{'type':'number','display':null,'title':'Peso de Entrada','mode':'inline','search': true,'placeholder': 'Peso de entrada',},
        'weightOut':{'type':'number','display':null,'title':'Peso de Salida','mode':'inline','search': true,'placeholder': 'Peso de salida',},
    };

    assignOperacion(data){
        this.dataList.list.unshift(data);
        this.dataList.list.pop();
    }

    public paramsFilter:any = {
        title: "Filtrar Operaciones",
        idModal: "modalFilter",
        endpointForm: "",
    };

    loadWhere(where) {
        this.where = where;
        this.loadData();
    }
    
}