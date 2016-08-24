import {Component, OnInit} from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import {RestController} from "../common/restController";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {Xeditable} from "../common/xeditable";
import {Filter} from "../utils/filter/filter";
import {globalService} from "../common/globalService";
import {Save} from "../utils/save/save";

@Component({
    selector: 'tipo-servicio',
    templateUrl: 'app/tipoServicio/index.html',
    styleUrls: ['app/tipoServicio/style.css'],
    directives:[Xeditable,Filter,Save]
})
export class TipoServicio extends RestController implements OnInit{

    public dataSelect:any={};
    public viewOptions:any={};
    public permissions:any={};


    public WEIGTH_METRIC_SHORT:string="";
    public WEIGTH_METRIC:string="";
    public MONEY_METRIC_SHORT:string="";
    public MONEY_METRIC:string="";

    constructor(public router: Router,public http: Http,public toastr: ToastsManager,public myglobal:globalService) {
        super(http,toastr);
        this.setEndpoint("/type/services/")
    }
    initViewOptions(){
        this.viewOptions.title="Tipo de servicio";
        this.viewOptions['errors']={}
        this.viewOptions['errors'].title="ADVERTENCIA"
        this.viewOptions['errors'].list="No tiene permisos para ver los tipos de servicios"

    }
    initPermissions(){
        this.permissions['list']=this.myglobal.existsPermission('1');
        this.permissions['add']=this.myglobal.existsPermission('1');
        this.permissions['filter']=this.myglobal.existsPermission('1');
        this.permissions['lock']=this.myglobal.existsPermission('1');
        this.permissions['delete']=this.myglobal.existsPermission('1');
        this.permissions['update']=this.myglobal.existsPermission('1');

        this.permissions['actions']=this.permissions['delete'];


    }
    
    public params = {
        title: "Tipo de servicio",
        idModal: "saveTypeServices",
        endpoint: "/type/service/",
    }

    public rules={
        'title':{
            'type':'text',
            'key':'title',
            'icon':'fa fa-font',
            'required':true,
            'display':null,
            'maxLength':'35',
            'title':'Título',
            'mode':'inline',
            'placeholder': 'Titulo',
            'msg':{
                'error':'El título contiene errores',
            },
            'search': true
        },
        'code':{
            'type':'text',
            'key':'code',
            'icon':'fa fa-key',
            'required':true,
            'display':null,
            'maxLength':'35',
            'title':'Codigo',
            'mode':'inline',
            'placeholder': 'Codigo',
            'msg':{
                'error':'El codigo contiene errores',
            },
            'search': true
        },
        'price':{
            'type':'number',
            'key':'price',
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
    public ruleObject:any={}

    ngOnInit(){
        this.initViewOptions();
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

    initRuleObject(){
        this.ruleObject={
            'icon':'fa fa-list',
            "type": "text",
            "key": "typeService",
            "title": "Tipo de servicio",
            'object':true,
            "placeholder": "Ingrese el codigo del tipo de servicio",
            'paramsSearch': {
                'label':{'title':"tipo: ",'detail':"Detalle: "},
                'endpoint':"/search/type/services/",
                'where':'',
                'imageGuest':'/assets/img/truck-guest.png',
                'field':'typeService.id',
            },
            'search':true,
            'msg':{
                'errors':{
                    'object':'La marca no esta registrado',
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
        title: "Filtrar tipos de servicio",
        idModal: "modalFilter",
    };
    loadWhere(where) {
        this.where = where;
        this.loadData();
    }

}