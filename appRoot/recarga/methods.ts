import {Component, EventEmitter, Input, Pipe, OnInit} from '@angular/core';
import  {FormBuilder, Validators, Control, ControlGroup} from '@angular/common';
import {Http} from "@angular/http";
import {RestController} from "../common/restController";
import {SELECT_DIRECTIVES} from 'ng2-select/ng2-select';
import {Fecha} from "../utils/pipe";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {Search} from "../utils/search/search";
import {globalService} from "../common/globalService";
import {Datepicker} from "../common/xeditable";
import { Router }           from '@angular/router-deprecated';
import moment from "moment/moment";
declare var SystemJS:any;

@Component({
    selector: 'recarga-save',
    templateUrl: SystemJS.map.app+'/recarga/save.html',
    styleUrls: [SystemJS.map.app+'/recarga/style.css'],
    directives: [SELECT_DIRECTIVES,Search,Datepicker],
    outputs:['save'],
})
export class RecargaSave extends RestController implements OnInit{

    @Input() idModal:string;
    @Input() idCompany:string;
    @Input() money:string;

    public save:any;

    form: ControlGroup;
    company: Control;
    quantity: Control;
    reference: Control;
    referenceDate: Control;
    rechargeType: Control;
    RECHARGE_DEVOLUCION_ID:number;

    rechargeTypes:any = []; //Arreglo con todos los tipos de regarga

    constructor(public http:Http,public _formBuilder: FormBuilder,public toastr: ToastsManager,public myglobal:globalService) {
        super(http,toastr);
        this.setEndpoint('/recharges/');
        this.save = new EventEmitter();
    }
    ngOnInit() {
        this.initForm();
        this.RECHARGE_DEVOLUCION_ID=parseFloat(this.myglobal.getParams('RECHARGE_DEVOLUCION_ID'));
        if(this.idCompany)
            this.company.updateValue(this.idCompany);
        if(this.money)
            this.quantity.updateValue(this.money);
        if(this.myglobal.existsPermission('116'))
            this.getRechargeTypes();
    }

    initForm(){

        this.quantity = new Control("", Validators.compose([Validators.required]));
        this.company = new Control("", Validators.compose([Validators.required]));
        this.reference = new Control("", Validators.compose([Validators.required]));
        this.referenceDate = new Control("", Validators.compose([Validators.required]));
        this.rechargeType = new Control("", Validators.compose([Validators.required]));

        this.form = this._formBuilder.group({
            quantity: this.quantity,
            reference: this.reference,
            referenceDate: this.referenceDate,
            company: this.company,
            rechargeType: this.rechargeType,
        });
    }
    setRechargeType(id){
        this.rechargeType.updateValue(id);
    }
    setdata(company,money){
        this.company.updateValue(company);
        this.quantity.updateValue(money.toFixed(2)*-1);
    }
    getRechargeTypes(){
        let where = encodeURI("[['op':'ne','field':'id','value':4]]")
        this.httputils.onLoadList("/type/recharges?where="+where,this.rechargeTypes,this.error);
    }
    submitForm(){
        let that=this;
        if(this.myglobal.existsPermission('111')) {
            let successCallback = response => {
                that.resetForm();
                that.save.emit(response.json());
                that.toastr.success('Guardado con éxito','Notificación')
            };
            if(this.rechargeType.value == this.RECHARGE_DEVOLUCION_ID)
                if(this.quantity.value > 0)
                    this.quantity.updateValue(this.quantity.value*-1);

            let body = JSON.stringify(this.form.value);
            this.httputils.doPost(this.endpoint, body, successCallback, this.error);
        }
    }
    resetForm(){
        let that=this;
        Object.keys(this).forEach(key=>{
            if(that[key] instanceof Control){
                that[key].updateValue(null);
                that[key].setErrors(null);
                that[key]._pristine=true;
            }
        })
    }
    public formatDateFact = {
        format: "dd/mm/yyyy",
        startDate:'01/01/2016',
        startView: 2,
        minViewMode: 0,
        maxViewMode: 2,
        forceParse: false,
        language: "es",
        todayBtn: "linked",
        autoclose: true,
        todayHighlight: true,
    }

    loadFechaFac(data) {
        this.referenceDate.updateValue(data.date)
    }

    //asignar compania----------------------------------
    public searchCompany={
        title:"Compañia",
        idModal:"searchCompany",
        endpointForm:"/search/companies/",
        placeholderForm:"Ingrese el RUC",
        labelForm:{title:"Nombre: ",detail:"RUC: "},
    }
    public dataCompany:string;
    assignCompany(data){
        this.company.updateValue(data.id);
        this.dataCompany="Nombre: "+data.title+", RUC: "+data.detail;
    }
}
@Component({
    selector: 'recarga-timeline',
    templateUrl: SystemJS.map.app+'/recarga/timeline.html',
    styleUrls: [SystemJS.map.app+'/recarga/style.css'],
    inputs:['params'],
    pipes: [Fecha],
})
export class RecargaTimeLine extends RestController implements OnInit{

    // Formato de entrada
    // params={
    //     'offset':0,
    //     'max':5,
    //     'ruc':'123'
    // };

    public params:any={};

    public color= {
        'fa fa-cc-amex': 'bg-black',
        'fa fa-cc-mastercard': 'bg-blue',
        'fa fa-credit-card': 'bg-red',
        'fa fa-cc-diners-club': 'bg-dark',
        'fa fa-cc-paypal': 'bg-blue',
        'fa fa-google-wallet': 'bg-red',
        'fa fa-cc-discover': 'bg-orange',
        'fa fa-cc-stripe': 'bg-green',
        'fa fa-paypal': 'bg-yellow',
        'fa fa-cc-jcb': 'bg-violet',
        'fa fa-cc-visa': 'bg-pink',
        'fa fa-money': 'bg-violet',
        'fa fa-truck': 'bg-green',
        'fa fa-refresh': 'bg-ivonne',
    };
    
    constructor(public http:Http,public _formBuilder: FormBuilder,public toastr:ToastsManager, public myglobal:globalService) {
        super(http,toastr);
        this.setEndpoint('/search/recharges/');
    }
    ngOnInit() {
        if(this.myglobal.existsPermission('109'))
            this.loadData();
    }
    loadData(){
        this.httputils.onLoadList(this.endpoint+this.params.ruc+`?sort=id&order=desc&max=${this.params.max}&offset=${this.params.offset}`,this.dataList,this.error);
    }
    addtimeLine(event){
        event.preventDefault();
        let successCallback= response => {
            response.json().list.forEach(obj=>{
                this.dataList.list.push(obj);
            });
            this.dataList.count = response.json().count;
        }
        this.params.offset+=this.params.max;
        if(this.params.offset < this.dataList.count)
            this.httputils.doGet(this.endpoint+`?sort=id&order=desc&max=${this.params.max}&offset=${this.params.offset}`,successCallback,this.error)
    }
    formatDate(date,format){
        if(date)
            return moment(date).format(format);
        return "";
    }
    

}

declare var jQuery:any;

@Component({
    selector: 'recarga-factura',
    templateUrl: SystemJS.map.app+'/recarga/facturas.html',
    styleUrls: [SystemJS.map.app+'/recarga/style.css'],
    inputs:['params'],
    pipes: [Fecha],
})
export class RecargaFactura extends RestController implements OnInit{
    // public params={
    //     'dateStart':'27-06-2016',
    //     'dateEnd':'27-06-2016',
    // };
    public params:any={};

    constructor(public router: Router,public http:Http,public _formBuilder: FormBuilder,public toastr: ToastsManager,public myglobal:globalService) {
        super(http,toastr);
        this.setEndpoint('/search/recharges/');
    }
    ngOnInit() {
        if(this.myglobal.existsPermission('109')){
            this.max = 50;
            this.cargar()
        }
    }
    public rechargeTotal:any={};
    public MONEY_METRIC_SHORT=this.myglobal.getParams('MONEY_METRIC_SHORT');
    public MONEY_METRIC=this.myglobal.getParams('MONEY_METRIC');
    public cargar(){

        let recharge="";
        if(this.params.recharge && this.params.recharge!="-1")
            recharge=",['op':'eq','field':'rechargeType.id','value':"+this.params.recharge+"]";

        let whereList=encodeURI("[['op':'ge','field':'dateCreated','value':'"+this.params.dateStart+"','type':'date']," +
                            "['op':'lt','field':'dateCreated','value':'"+this.params.dateEnd+"','type':'date']"+recharge+"]");

        let whereTotal=encodeURI("[['op':'ge','field':'dateCreated','value':'"+this.params.dateStart+"','type':'date']," +
            "['op':'lt','field':'dateCreated','value':'"+this.params.dateEnd+"','type':'date']]");

        this.where="&where="+whereList
        this.endpoint="/search/recharges/";
        this.loadData();

        this.httputils.onLoadList('/total/recharges?where='+whereTotal,this.rechargeTotal,this.max,this.error);
    }
    goTaquilla(event,companyId:string) {
        event.preventDefault();
        let link = ['TaquillaSearh', {search: companyId}];
        this.router.navigate(link);
    }

    exportCSV(){
        jQuery("#content").tableToCSV();
    }
    formatDate(date,format){
        if(date)
            return moment(date).format(format);
        return "";
    }
}