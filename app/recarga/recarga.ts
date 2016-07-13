import {Component, ViewChild} from '@angular/core';
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
import {Xeditable} from "../common/xeditable";

@Component({
    selector: 'recarga',
    pipes: [Fecha],
    templateUrl: 'app/recarga/index.html',
    styleUrls: ['app/recarga/style.css'],
    directives:[RecargaSave,Xeditable,Filter]
})
export class Recarga extends RestController{
    public rules={
        'id': {'type':'number','disabled':true,'display':false,'title':'','placeholder': 'Identificador', 'search': true},
        'quantity':{'type':'number','display':null,'title':'Key','mode':'inline','placeholder': 'Cantidad', 'search': true,'double':true},
        'reference':{'type':'text','display':null,'title':'Valor','mode':'inline','placeholder': 'Referencia', 'search': true},
    };

    constructor(public router: Router,public http: Http,public toastr: ToastsManager,public myglobal:globalService) {
        super(http,toastr);
        this.setEndpoint('/recharges/');
    }
    ngOnInit(){
        if(this.myglobal.existsPermission('109')){
            this.max = 30;
            this.loadData();
        }
    }
    assignRecarga(data){
        this.dataList.list.unshift(data);
        this.dataList.list.pop();
    }
    //Cargar Where del filter
    public paramsFilter:any = {
        title: "Filtrar recargas",
        idModal: "modalFilter",
        endpointForm: "",
    };
    loadWhere(where) {
        this.where = where;
        this.loadData();
    }
}


@Component({
    selector: 'ingresos',
    directives:[RecargaFactura],
    templateUrl: 'app/recarga/ingresos.html',
    styleUrls: ['app/recarga/style.css'],
})
export class RecargaIngresos extends RestController{

    constructor(public router: Router,http: Http,public _formBuilder: FormBuilder,public toastr: ToastsManager) {
        super(http,toastr);
        this.validTokens();
    }
    ngOnInit() {
        this.initForm();
    }

    validTokens(){
        if(!localStorage.getItem('bearer'))
        {
            let link = ['AccountLogin', {}];
            this.router.navigate(link);
        }
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
    loadFacturas(event){
        event.preventDefault();
        if(!this.dateEnd.value)
        {
            this.dateEnd.updateValue(moment(this.dateStart.value.toString()).format('YYYY-MM-DD'));
            this.dateEnd.updateValue(moment(this.dateEnd.value).add(1, 'days'));
        }

        this.paramsFactura={
            'dateStart': moment(this.dateStart.value.toString()).format('DD-MM-YYYY'),
            'dateEnd':   moment(this.dateEnd.value.toString()).format('DD-MM-YYYY'),
        };
        if(this.recargaFactura)
        {
            this.recargaFactura.params = this.paramsFactura;
            this.recargaFactura.cargar();
        }

        this.consultar=true;
        this.dateEnd.updateValue("");
    }
    
}

@Component({
    selector: 'libro',
    pipes: [Fecha],
    templateUrl: 'app/recarga/libro.html',
    styleUrls: ['app/recarga/style.css'],
})
export class RecargaLibro extends RestController{

    constructor(public router: Router,http: Http,public _formBuilder: FormBuilder,public toastr: ToastsManager) {
        super(http,toastr);
        this.setEndpoint('/search/recharges');
    }
    ngOnInit() {
        this.validTokens();
        this.initForm();
    }
    initForm(){
        this.dateStart = new Control("", Validators.compose([Validators.required]));
        this.dateEnd = new Control("");

        this.form = this._formBuilder.group({
            dateStart: this.dateStart,
            dateEnd: this.dateEnd,
        });
    }
    validTokens(){
        if(!localStorage.getItem('bearer'))
        {
            let link = ['AccountLogin', {}];
            this.router.navigate(link);
        }
    }

    //consultar Libro
    form: ControlGroup;
    dateStart:Control;
    dateEnd:Control;
    public params:any={};
    loadLibro(event){
        event.preventDefault();
        if(!this.dateEnd.value)
        {
            this.dateEnd.updateValue(moment(this.dateStart.value.toString()).format('YYYY-MM-DD'));
            this.dateEnd.updateValue(moment(this.dateEnd.value).add(1, 'days'));
        }

        this.params={
            'dateStart': moment(this.dateStart.value.toString()).format('DD-MM-YYYY'),
            'dateEnd':   moment(this.dateEnd.value.toString()).format('DD-MM-YYYY'),
        };
        this.dateEnd.updateValue("");
        this.where = "&where=[['op':'ge','field':'dateCreated','value':'"+this.params.dateStart+"','type':'date']," +
                     "['op':'lt','field':'dateCreated','value':'"+this.params.dateEnd+"','type':'date']]&order=asc";
        this.max=100;
        this.loadData();
    }

}