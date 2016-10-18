import {Component, ViewChild, OnInit} from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import {RestController} from "../common/restController";
import {RecargaSave, RecargaFactura} from "./methods";
import {Fecha} from "../utils/pipe";
import {FormBuilder, ControlGroup, Control, Validators} from "@angular/common";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import moment from 'moment/moment';
import {globalService} from "../common/globalService";
import {Filter} from "../utils/filter/filter";
import {Xeditable, Datepicker} from "../common/xeditable";
import {OperacionPrint} from "../operacion/methods";
declare var SystemJS:any;

@Component({
    selector: 'recarga',
    pipes: [Fecha],
    templateUrl: SystemJS.map.app+'/recarga/index.html',
    styleUrls: [SystemJS.map.app+'/recarga/style.css'],
    directives:[RecargaSave,Xeditable,Filter,OperacionPrint]
})
export class Recarga extends RestController implements OnInit{
    public MONEY_METRIC_SHORT=this.myglobal.getParams('MONEY_METRIC_SHORT');
    public MONEY_METRIC=this.myglobal.getParams('MONEY_METRIC');

    public rules={
        'quantity':{'type':'number','display':null,'title':'Key','mode':'inline','placeholder': 'Cantidad', 'search': true,'double':true,'step':'0.01'},
        'reference':{'type':'text','display':null,'title':'Valor','mode':'inline','placeholder': 'Referencia', 'search': true},
        'typeRecharges':{
            'type':'text',
            'key':'typeRecharges',
            'paramsSearch': {
                'label':{'title':"Nombre: ",'detail':"Detalle: "},
                'endpoint':"/search/type/recharges/",
                'where':'',
                'imageGuest':'/assets/img/truck-guest.png',
                'field':'rechargeType.id',
            },
            'search':true,
            'object':true,
            'title':'Tipo de recarga',
            'placeholder':'Ingrese el tipo de recarga',
            'icon':'fa fa-money',
        },
    };
    public dataSelect:any={};

    constructor(public router: Router,public http: Http,public toastr: ToastsManager,public myglobal:globalService) {
        super(http,toastr);
        this.setEndpoint('/recharges/');
    }
    ngOnInit(){
        if(this.myglobal.existsPermission('109')){
            this.max = 30;
            this.where="&where="+encodeURI("[['op':'isNull','field':'o.id']]");
            this.loadData();
        }
    }
    assignRecarga(data){
        this.dataList.list.unshift(data);
        if(this.dataList.page.length > 1)
            this.dataList.list.pop();
    }
    //Cargar Where del filter
    public paramsFilter:any = {
        title: "Filtrar recargas",
        idModal: "modalFilter",
        endpoint: "",
    };
    loadWhere(where) {
        if(where.length == 13)
            this.where = where.slice(0,-3)+encodeURI("['op':'isNull','field':'o.id']]");
        else if(where.length==0)
            this.where = "&where="+encodeURI("[['op':'isNull','field':'o.id']]");
        else
            this.where = where.slice(0,-3)+encodeURI(",['op':'isNull','field':'o.id']]");
        this.loadData();
    }
    goTaquilla(event,companyId:string) {
        event.preventDefault();
        let link = ['TaquillaSearh', {search: companyId}];
        this.router.navigate(link);
    }

    @ViewChild(OperacionPrint)
    operacionPrint:OperacionPrint;
    onPrint(data){
        let successCallback= response => {
            if(this.operacionPrint)
                this.operacionPrint.data=response.json();
        };
        this.httputils.doGet('/operations/'+data.operationId,successCallback,this.error)
    }
    formatDate(date,format){
        if(date)
            return moment(date).format(format);
        return "";
    }
}


@Component({
    selector: 'ingresos',
    directives:[RecargaFactura,Datepicker],
    templateUrl: SystemJS.map.app+'/recarga/ingresos.html',
    styleUrls: [SystemJS.map.app+'/recarga/style.css'],
})
export class RecargaIngresos extends RestController implements OnInit{

    constructor(public router: Router,http: Http,public _formBuilder: FormBuilder,public toastr: ToastsManager,public myglobal:globalService) {
        super(http,toastr);
    }
    ngOnInit() {
        this.initForm();
        this.getRechargeTypes();
    }

    //lapso de fechas
    public itemsFecha=[
        {'id':'1','text':'Hoy'},
        {'id':'2','text':'Semana actual'},
        {'id':'3','text':'Mes actual'},
        {'id':'4','text':'Mes anterior'},
        {'id':'5','text':'Últimos 3 meses'},
        {'id':'6','text':'Año actual'},
    ]
    setFecha(id){
        //Thu Jul 09 2015 00:00:00 GMT-0400 (VET)
        let day = moment().format('lll');
        let val;
        switch (id)
        {
            case "1" : //hoy
                this.dateStart.updateValue(day);
                break;
            case "2" ://Semana Actual
                this.dateStart.updateValue(moment(day).startOf('week'));
                this.dateEnd.updateValue(day);
                break;
            case "3" ://mes actual
                this.dateStart.updateValue(moment().startOf('month'));
                this.dateEnd.updateValue(day);
                break;
            case "4" ://mes anterior
                this.dateStart.updateValue(moment().subtract(1, 'month').startOf('month'));
                this.dateEnd.updateValue(moment().subtract(1, 'month').endOf('month'));
                break;
            case "5" ://ultimos 3 meses
                this.dateStart.updateValue(moment().subtract(3, 'month').startOf('month'));
                this.dateEnd.updateValue(day);
                break;
            case "6" ://ano actual
                this.dateStart.updateValue(moment().startOf('year'));
                this.dateEnd.updateValue(day);
                break;
        }
        if(id!='-1')
            this.loadFacturas();


    }


    public formatDateFact = {
        format: "dd/mm/yyyy",
        startDate:'01/01/2016',
        startView: 2,
        minViewMode: 0,
        maxViewMode: 2,
        language: "es",
        todayBtn: "linked",
        forceParse: false,
        autoclose: true,
        todayHighlight: true,
    }

    loadFechaFac(data) {
        if (data.key == "1")
            this.dateStart.updateValue(data.date)
        else
            this.dateEnd.updateValue(data.date)
    }

    //consultar Facturas
    form: ControlGroup;
    dateStart:Control;
    dateEnd:Control;
    initForm(){
        this.dateStart = new Control("", Validators.compose([Validators.required]));
        this.dateEnd = new Control("");

        this.form = this._formBuilder.group({
            dateStart: this.dateStart,
            dateEnd: this.dateEnd,
        });
    }
    @ViewChild(RecargaFactura)
    recargaFactura:RecargaFactura;
    public paramsFactura:any={};
    public consultar=false;
    loadFacturas(event?){
        if(event)
            event.preventDefault();
        let final=this.dateEnd.value;
        if (!this.dateEnd.value) {
            final = (moment(this.dateStart.value).add(1, 'days'));
        }
        else{
            final = (moment(this.dateEnd.value).add(1, 'days'));
        }

        this.paramsFactura = {
            'dateStart': moment(this.dateStart.value.toString()).format('DD-MM-YYYY'),
            'dateEnd': moment(final.toString()).format('DD-MM-YYYY'),
            'recharge':this.idRecharge,
        };
        if (this.recargaFactura) {
            this.recargaFactura.params = this.paramsFactura;
            if(this.myglobal.existsPermission('109'))
                this.recargaFactura.cargar();
        }
        this.consultar = true;
    }
    public rechargeTotal:any={}
    public idRecharge:string;
    public rechargeTypes:any={};
    getRechargeTypes(){
        this.httputils.onLoadList("/type/recharges",this.rechargeTypes,this.error);
    }
    setType(data){
        this.idRecharge=data;
    }
    
}

declare var jQuery:any;

@Component({
    selector: 'libro',
    pipes: [Fecha],
    directives:[Datepicker],
    templateUrl: SystemJS.map.app+'/recarga/libro.html',
    styleUrls: [SystemJS.map.app+'/recarga/style.css'],
})
export class RecargaLibro extends RestController implements OnInit{

    constructor(public router: Router,http: Http,public _formBuilder: FormBuilder,public toastr: ToastsManager,public myglobal:globalService) {
        super(http,toastr);
        this.setEndpoint('/search/recharges');
    }
    ngOnInit() {
        this.initForm();
        this.getRechargeTypes();
    }
    public MONEY_METRIC_SHORT=this.myglobal.getParams('MONEY_METRIC_SHORT');

    //lapso de fechas
    public itemsFecha=[
        {'id':'1','text':'Hoy'},
        {'id':'2','text':'Semana actual'},
        {'id':'3','text':'Mes actual'},
        {'id':'4','text':'Mes anterior'},
        {'id':'5','text':'Últimos 3 meses'},
        {'id':'6','text':'Año actual'},
    ]
    setFecha(id){
        //Thu Jul 09 2015 00:00:00 GMT-0400 (VET)
        let day = moment().format('lll');
        let val;
        switch (id)
        {
            case "1" : //hoy
                this.dateStart.updateValue(day);
                break;
            case "2" ://Semana Actual
                this.dateStart.updateValue(moment(day).startOf('week'));
                this.dateEnd.updateValue(day);
                break;
            case "3" ://mes actual
                this.dateStart.updateValue(moment().startOf('month'));
                this.dateEnd.updateValue(day);
                break;
            case "4" ://mes anterior
                this.dateStart.updateValue(moment().subtract(1, 'month').startOf('month'));
                this.dateEnd.updateValue(moment().subtract(1, 'month').endOf('month'));
                break;
            case "5" ://ultimos 3 meses
                this.dateStart.updateValue(moment().subtract(3, 'month').startOf('month'));
                this.dateEnd.updateValue(day);
                break;
            case "6" ://ano actual
                this.dateStart.updateValue(moment().startOf('year'));
                this.dateEnd.updateValue(day);
                break;
        }
        if(id!='-1')
            this.loadLibro();


    }

    public formatDateFact = {
        format: "dd/mm/yyyy",
        startDate:'01/01/2016',
        startView: 2,
        minViewMode: 0,
        maxViewMode: 2,
        language: "es",
        forceParse: false,
        autoclose: true,
        todayBtn: "linked",
        todayHighlight: true,
    }

    loadFechaFac(data) {
        if (data.key == "1")
            this.dateStart.updateValue(data.date)
        else
            this.dateEnd.updateValue(data.date)
    }

    initForm(){
        this.dateStart = new Control("", Validators.compose([Validators.required]));
        this.dateEnd = new Control("");

        this.form = this._formBuilder.group({
            dateStart: this.dateStart,
            dateEnd: this.dateEnd,
        });
    }
    goTaquilla(event,companyId:string) {
        event.preventDefault();
        let link = ['TaquillaSearh', {search: companyId}];
        this.router.navigate(link);
    }
    //consultar Libro
    form: ControlGroup;
    dateStart:Control;
    dateEnd:Control;
    public params:any={};
    loadLibro(event?){
        if(event)
            event.preventDefault();
        let final=this.dateEnd.value;
        if (!this.dateEnd.value) {
            final = (moment(this.dateStart.value).add(1, 'days'));
        }
        else{
            final = (moment(this.dateEnd.value).add(1, 'days'));
        }

        this.params = {
            'dateStart': moment(this.dateStart.value.toString()).format('DD-MM-YYYY'),
            'dateEnd': moment(final.toString()).format('DD-MM-YYYY'),
        };
        let recharge=""
        if(this.idRecharge && this.idRecharge!="-1")
            recharge=",['op':'eq','field':'rechargeType.id','value':"+this.idRecharge+"]"

        let where ="[['op':'ge','field':'dateCreated','value':'"+this.params.dateStart+"','type':'date']," +
                    "['op':'lt','field':'dateCreated','value':'"+this.params.dateEnd+"','type':'date']"+recharge+"]&order=asc";
        this.where = "&where="+encodeURI(where);
        this.max=50;
        if(this.myglobal.existsPermission('109')){
            this.loadData();
            this.httputils.onLoadList('/total/recharges?where='+encodeURI(where),this.rechargeTotal,this.max,this.error);
        }
    }
    public rechargeTotal:any={}
    public idRecharge:string;
    public rechargeTypes:any={};
    getRechargeTypes(){
        this.httputils.onLoadList("/type/recharges",this.rechargeTypes,this.error);
    }
    setType(data){
        this.idRecharge=data;
    }

    exportCSV(){
        jQuery("#content").tableToCSV();
    }
    formatDate(date,format){
        if(date)
            return moment(date).format(format);
        return "";
    }
    loadAll(event){
        event.preventDefault();
        this.max = this.dataList.count;
        this.loadData();
    }

}