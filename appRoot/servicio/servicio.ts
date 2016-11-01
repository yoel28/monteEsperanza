import {Component, OnInit,ViewChild} from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import {RestController} from "../common/restController";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {Xeditable} from "../common/xeditable";
import {Filter} from "../utils/filter/filter";
import {globalService} from "../common/globalService";
import {Save} from "../utils/save/save";
import {TipoServicio} from "../tipoServicio/tipoServicio";
import {Tooltip} from "../utils/tooltips/tooltips";
declare var SystemJS:any;

@Component({
    selector: 'servicio',
    templateUrl: SystemJS.map.app+'/servicio/index.html',
    styleUrls: [SystemJS.map.app+'/servicio/style.css'],
    directives:[Xeditable,Filter,Save,Tooltip],
    providers:[TipoServicio]
})
export class Servicio extends RestController implements OnInit{

    public dataSelect:any={};
    public viewOptions:any={};
    public permissions:any={};


    public WEIGTH_METRIC_SHORT:string="";
    public WEIGTH_METRIC:string="";
    public MONEY_METRIC_SHORT:string="";
    public MONEY_METRIC:string="";

    constructor(public router: Router,public http: Http,public toastr: ToastsManager,public myglobal:globalService,public tipoServicio:TipoServicio) {
        super(http,toastr);
        this.setEndpoint("/services/");
        this.tipoServicio.initPermissions();
    }
    initViewOptions(){
        this.viewOptions.title="Servicios";
        this.viewOptions['errors']={}
        this.viewOptions['errors'].title="ADVERTENCIA"
        this.viewOptions['errors'].list="No tiene permisos para ver los servicios"

    }
    initPermissions(){
        this.permissions['list']=this.myglobal.existsPermission('216');
        this.permissions['add']=this.myglobal.existsPermission('215');
        this.permissions['filter']=this.myglobal.existsPermission('221');
        this.permissions['lock']=this.myglobal.existsPermission('219');
        this.permissions['delete']=this.myglobal.existsPermission('217');
        this.permissions['update']=this.myglobal.existsPermission('218');

        this.permissions['actions']=this.permissions['delete'];


    }
    
    public params = {
        title: "Servicios",
        idModal: "saveServices",
        endpoint: "/services/",
    }

    public rules:any={};
    public ruleObject:any={}

    ngOnInit(){
        this.initViewOptions();
        this.initRules();
        this.initPermissions();
        this.initRuleObject();

        if(this.permissions['list']){
            this.max = 10;

            this.WEIGTH_METRIC_SHORT=this.myglobal.getParams('WEIGTH_METRIC_SHORT');
            this.WEIGTH_METRIC=this.myglobal.getParams('WEIGTH_METRIC');
            this.MONEY_METRIC_SHORT=this.myglobal.getParams('MONEY_METRIC_SHORT');
            this.MONEY_METRIC=this.myglobal.getParams('MONEY_METRIC');

            this.loadData();
        }

    }
    initRules(){
        this.tipoServicio.initRuleObject();

        this.rules={
            'plate':{
                'type':'text',
                'key':'plate',
                'icon':'fa fa-truck',
                'display':null,
                'maxLength':'35',
                'title':'Placa',
                'mode':'inline',
                'placeholder': 'Placa',
                'msg':{
                    'error':'La placa contiene errores',
                },
                'search': true
            },
            'ruc':{
                'type':'text',
                'key':'ruc',
                'icon':'fa fa-key',
                'display':null,
                'maxLength':'35',
                'title':'RUC',
                'mode':'inline',
                'placeholder': 'RUC',
                'msg':{
                    'error':'El RUC contiene errores',
                },
                'search': true
            },
            'serviceType':this.tipoServicio.ruleObject,
            'amount':{
                'type':'number',
                'key':'amount',
                'step':'0.01',
                'icon':'fa fa-money',
                'required':true,
                'display':null,
                'double':true,
                'title':'Precio',
                'mode':'inline',
                'placeholder': 'Precio',
                'search': true,
                'msg':{
                    'error':'El precio debe ser numerico',
                }
            },
            'weight':{
                'type':'number',
                'key':'weight',
                'step':'0.001',
                'icon':'fa fa-balance-scale',
                'display':null,
                'double':true,
                'title':'Peso',
                'mode':'inline',
                'placeholder': 'Peso',
                'search': true,
                'msg':{
                    'error':'El peso debe ser numerico',
                },
                'refreshField':{
                    'icon':'fa fa-refresh',
                    'endpoint':'/weight/',
                    'field':'weight',
                }
            },
            'detail':{
                'type':'textarea',
                'key':'detail',
                'icon':'fa fa-list',
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
        this.rules['serviceType'].required=true;
    }
    initRuleObject(){
        this.ruleObject={
            'icon':'fa fa-list',
            "type": "text",
            "key": "service",
            "title": "Servicio",
            'object':true,
            "placeholder": "Ingrese el codigo del servicio",
            'paramsSearch': {
                'label':{'title':"tipo: ",'detail':"Detalle: "},
                'endpoint':"/search/services/",
                'where':'',
                'imageGuest':'/assets/img/truck-guest.png',
                'field':'service.id',
            },
            'search':true,
            'msg':{
                'errors':{
                    'object':'El servicio no esta registrado',
                    'required':'El campo es obligatorio'
                },
            }
        }
    }
    assignData(data){
        this.dataList.list.unshift(data);
        if(this.dataList.page.length > 1)
            this.dataList.list.pop();
    }
    //Cargar Where del filter
    public paramsFilter:any = {
        title: "Filtrar servicios",
        idModal: "modalFilter",
    };
    loadWhere(where) {
        this.where = where;
        this.loadData();
    }
}