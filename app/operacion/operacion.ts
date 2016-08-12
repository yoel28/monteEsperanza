import {Component, ViewChild, OnInit} from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import {RestController} from "../common/restController";
import  {OperacionSave, OperacionPrint} from "./methods";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {Xeditable} from "../common/xeditable";
import {globalService} from "../common/globalService";
import {Filter} from "../utils/filter/filter";
import {Fecha} from "../utils/pipe";
import moment from "moment/moment";


@Component({
    selector: 'operacion',
    templateUrl: 'app/operacion/index.html',
    styleUrls: ['app/operacion/style.css'],
    directives:[OperacionSave,Xeditable,Filter,OperacionPrint],
    pipes:[Fecha]
})
export class Operacion extends RestController implements OnInit{

    public dataSelect:any={};
    public MONEY_METRIC_SHORT:string="";
    constructor(public router: Router,public http: Http,public toastr: ToastsManager, public myglobal:globalService) {
        super(http,toastr);
        this.setEndpoint('/operations/');
    }
    ngOnInit(){
        if (this.myglobal.existsPermission('93')) {
            this.max = 15;
            this.loadData();
            this.MONEY_METRIC_SHORT=this.myglobal.getParams('MONEY_METRIC_SHORT');
        }
    }

    public rules={
        'weightIn':{
            'type':'number','display':null,'title':'Peso de Entrada','mode':'inline','search': true,'placeholder': 'Peso de entrada','double':true,'icon':'fa fa-balance-scale',},
        'weightOut':{'type':'number','display':null,'title':'Peso de Salida','mode':'inline','search': true,'placeholder': 'Peso de salida','double':true,'icon':'fa fa-balance-scale',},

        'vehicle':{
            'type':'text',
            'key':'vehicle',
            'paramsSearch': {
                'label':{'title':"Empresa: ",'detail':"Placa: "},
                'endpoint':"/search/vehicles/",
                'where':'',
                'imageGuest':'/assets/img/truck-guest.png',
                'field':'vehicle.id',
            },
            'search':true,
            'object':true,
            'title':'Vehículo',
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
            'title':'Cliente',
            'placeholder':'Ingrese el RUC o nombre del cliente',
            'icon':'fa fa-building-o',
        },
        'trashType':{
            'type':'text',
            'required':true,
            'key':'trashType',
            'readOnly':false,
            'permissions':'136',
            'paramsSearch': {
                'label':{'title':"Tipo: ",'detail':"Referencia: "},
                'endpoint':"/search/type/trash/",
                'where':'',
                'imageGuest':'/assets/img/trash-guest.png',
                'field':'trashType.id',
            },
            'icon':'fa fa-trash',
            'search':true,
            'object':true,
            'title':'Tipo de basura',
            'placeholder':'Referencia del tipo de basura',
            'msg':{
                'error':'El tipo de basura contiene errores',
                'notAuthorized':'No tiene permisos de listar los tipos de basura',
            },
        },
        'route':{
            'type':'text',
            'search':true,
            'required':true,
            'key':'route',
            'readOnly':false,
            'paramsSearch': {
                'label':{'title':"Ruta: ",'detail':"Referencia: "},
                'endpoint':"/search/routes/",
                'where':'',
                'imageGuest':'/assets/img/truck-guest.png',
                'field':'route.id',
            },
            'icon':'fa fa-random',
            'object':true,
            'title':'Ruta',
            'placeholder':'Referencia de la ruta',
            'permissions':'69',
            'msg':{
                'error':'La ruta contiene errores',
                'notAuthorized':'No tiene permisos de listar las rutas',
            },
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
    public onPrint(data){
        if(this.operacionPrint)
            this.operacionPrint.data=data
    }
    public PrintAutomatic:string="";
    onEditableWeight(field,data,value,endpoint):any{
        let cond = this.myglobal.getParams('PesoE>PesoS');
        let peso = parseFloat(value);
        let that = this;
        if(
            peso > 0.0 &&
            (
                (field== 'weightOut' && cond=="true" && data.weightIn >= peso) ||
                (field== 'weightIn'  && cond=="true" && peso >= data.weightOut) ||
                (cond!="true")
            )
        )
        {
            let json = {};
            json[field] = parseFloat(value);
            let body = JSON.stringify(json);
            let error = err => {
                that.toastr.error(err.json().message);
            };
            let successCallback= response => {
                Object.assign(data, response.json());
                if(that.toastr)
                    that.toastr.success('Actualizado con éxito','Notificación');
            }
            return this.httputils.doPut(endpoint + data.id,body,successCallback,error)
        }
        //return 'El peso de entrada debe ser mayor que el peso de salida';
    }
    goTaquilla(event,companyId:string) {
        event.preventDefault();
        let link = ['TaquillaSearh', {search: companyId}];
        this.router.navigate(link);
    }
    onRechargeAutomatic(event,data){
        let that=this;
        event.preventDefault();
        let successCallback= response => {
            Object.assign(data, response.json());
            if(that.toastr)
                that.toastr.success('Pago cargado con éxito','Notificación');

        }
        this.httputils.doGet('/pay/'+data.id,successCallback,this.error);
    }
    formatDate(date,format){
        if(date)
            return moment(date).format(format);
        return "";
    }
    public view={
        'Cliente':true,
        'Grupos':true,
        'Fecha de transaccion':true,
        'Recibo':true,
        'Rutas':false,
        'Tipo de basura':false,
        'Operador':true,
        'Monto':true,
        'Vehiculo':true,
        'Peso de entrada':true,
        'Peso de salida':true,
    };
    getKeys(data){
        return Object.keys(data);
    }
}

@Component({
    selector: 'operacion-monitor',
    templateUrl: 'app/operacion/monitor.html',
    styleUrls: ['app/operacion/style.css'],
    pipes:[Fecha]
})
export class OperacionMonitor extends RestController implements OnInit{

    constructor(public router: Router,public http: Http,public toastr: ToastsManager, public myglobal:globalService) {
        super(http,toastr);
        this.setEndpoint('/operations/');
    }
    ngOnInit(){
        this.where="&where=[['op':'isNull','field':'weightOut']]"
        if (this.myglobal.existsPermission('165')) {
            this.max = 15;
            this.loadData();
        }
    }
    goTaquilla(event,companyId:string) {
        event.preventDefault();
        let link = ['TaquillaSearh', {search: companyId}];
        this.router.navigate(link);
    }

}

