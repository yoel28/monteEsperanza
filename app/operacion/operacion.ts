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

    public dataSelect:any={};
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
        'weightIn':{'type':'number','display':null,'title':'Peso de Entrada','mode':'inline','search': true,'placeholder': 'Peso de entrada','double':true},
        'weightOut':{'type':'number','display':null,'title':'Peso de Salida','mode':'inline','search': true,'placeholder': 'Peso de salida','double':true},
        'vehicle':{
            'type':'text',
            'key':'vehicle',
            'paramsSearch': {
                'label':{'title':"Placa: ",'detail':"Empresa: "},
                'endpoint':"/search/vehicles/",
                'where':'',
                'imageGuest':'/assets/img/truck-guest.png',
                'field':'vehicle.id',
            },
            'search':true,
            'object':true,
            'title':'Buscar vehículo',
            'placeholder':'ingrese la placa del vehículo',
            'icon':'fa fa-truck',
        },
    };

    assignOperacion(data){
        this.dataList.list.unshift(data);
        this.dataList.list.pop();
    }

    public paramsFilter:any = {
        title: "Filtrar operaciones",
        idModal: "modalFilter",
        endpointForm: "",
    };

    loadWhere(where) {
        this.where = where;
        if (this.myglobal.existsPermission('93')) {
            this.loadData();
        }
    }
    
}