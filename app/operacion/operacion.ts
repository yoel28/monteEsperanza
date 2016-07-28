import {Component, ViewChild} from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import {RestController} from "../common/restController";
import  {OperacionSave, OperacionPrint} from "./methods";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {Xeditable} from "../common/xeditable";
import {globalService} from "../common/globalService";
import {Filter} from "../utils/filter/filter";
import {Fecha} from "../utils/pipe";

@Component({
    selector: 'operacion',
    templateUrl: 'app/operacion/index.html',
    styleUrls: ['app/operacion/style.css'],
    directives:[OperacionSave,Xeditable,Filter,OperacionPrint],
    pipes:[Fecha]
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
            'placeholder':'Ingrese la placa del vehículo',
            'icon':'fa fa-truck',
        },
        'company':{
            'type':'text',
            'key':'company',
            'paramsSearch': {
                'label':{'title':"Cliente: ",'detail':"RUC: "},
                'endpoint':"/search/companies/",
                'where':'',
                'imageGuest':'/assets/img/company-guest.png',
                'field':'company.id',
            },
            'search':true,
            'object':true,
            'title':'Buscar cliente',
            'placeholder':'Ingrese el RUC o nombre del cliente',
            'icon':'fa fa-building-o',
        },
    };

    assignOperacion(data){
        this.dataList.list.unshift(data);
        if(this.dataList.page.length > 1)
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
    @ViewChild(OperacionPrint)
    operacionPrint:OperacionPrint;
    onPrint(data){
        if(this.operacionPrint)
            this.operacionPrint.data=data
    }
    onEditableWeight(field,data,value,endpoint){
        let cond = this.myglobal.getParams('PesoE>PesoS');
        let peso = parseFloat(value);
        if((field== 'weightOut' && cond=="true" && data.weightIn > peso) || (field== 'weightIn' && cond=="true" && peso > data.weightOut) || (cond!="true"))
        {
            let json = {};
            json[field] = parseFloat(value);
            let body = JSON.stringify(json);
            let error = err => {
                this.toastr.error(err.json().message);
            };
            return (this.httputils.onUpdate(endpoint + data.id, body, data, error));
        }
    }


}