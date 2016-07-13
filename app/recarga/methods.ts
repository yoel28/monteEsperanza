import {Component, EventEmitter, Input, Pipe} from '@angular/core';
import  {FormBuilder, Validators, Control, ControlGroup} from '@angular/common';
import {Http} from "@angular/http";
import {RestController} from "../common/restController";
import {SELECT_DIRECTIVES} from 'ng2-select/ng2-select';
import {Fecha} from "../utils/pipe";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {Search} from "../utils/search/search";
import {globalService} from "../common/globalService";

@Component({
    selector: 'recarga-save',
    templateUrl: 'app/recarga/save.html',
    styleUrls: ['app/recarga/style.css'],
    directives: [SELECT_DIRECTIVES,Search],
    outputs:['save'],
})
export class RecargaSave extends RestController{

    @Input() idModal:string;
    @Input() idVehicle:string;

    public save:any;

    form: ControlGroup;
    vehicle: Control;
    quantity: Control;
    reference: Control;
    referenceDate: Control;
    rechargeType: Control;

    rechargeTypes:any = []; //Arreglo con todos los tipos de regarga

    constructor(public http:Http,public _formBuilder: FormBuilder,public toastr: ToastsManager,public myglobal:globalService) {
        super(http,toastr);
        this.setEndpoint('/recharges/');
        this.save = new EventEmitter();
    }
    ngOnInit() {
        this.initForm();
        if(this.idVehicle)
            this.vehicle.updateValue(this.idVehicle);
        if(this.myglobal.existsPermission('116'))
            this.getRechargeTypes();
    }

    initForm(){

        this.quantity = new Control("", Validators.compose([Validators.required]));
        this.vehicle = new Control("", Validators.compose([Validators.required]));
        this.reference = new Control("", Validators.compose([Validators.required]));
        this.referenceDate = new Control("", Validators.compose([Validators.required]));
        this.rechargeType = new Control("", Validators.compose([Validators.required]));

        this.form = this._formBuilder.group({
            quantity: this.quantity,
            reference: this.reference,
            referenceDate: this.referenceDate,
            vehicle: this.vehicle,
            rechargeType: this.rechargeType,
        });
    }
    setRechargeType(id){
        this.rechargeType.updateValue(id);
    }
    getRechargeTypes(){
        this.httputils.onLoadList("/type/recharges?where=[['op':'ne','field':'enabled','value':false]]",this.rechargeTypes,this.error);
    }
    submitForm(){
        let successCallback= response => {
            this.save.emit(response.json());
        };
        let body = JSON.stringify(this.form.value);
        this.httputils.doPost(this.endpoint,body,successCallback,this.error);
    }

    //asignar vehiculo----------------------------------
    public searchVehicle={
        title:"Vehiculo",
        idModal:"searchVehicle",
        endpointForm:"/search/vehicles/",
        placeholderForm:"Ingrese la placa",
        labelForm:{name:"Placa: ",detail:"Empresa: "},
    }
    public dataVehicle:string;
    assignVehicle(data){
        this.vehicle.updateValue(data.id);
        this.dataVehicle="Placa: "+data.title+", Empresa: "+data.detail;
    }
}
@Component({
    selector: 'recarga-timeline',
    templateUrl: 'app/recarga/timeline.html',
    styleUrls: ['app/recarga/style.css'],
    inputs:['params'],
    pipes: [Fecha],
})
export class RecargaTimeLine extends RestController{

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
        'fa fa-cc-paypal': 'bg-lime',
        'fa fa-google-wallet': 'bg-red',
        'fa fa-cc-discover': 'bg-orange',
        'fa fa-cc-stripe': 'bg-green',
        'fa fa-paypal': 'bg-yellow',
        'fa fa-cc-jcb': 'bg-violet',
        'fa fa-cc-visa': 'bg-pink',
        'fa fa-money': 'bg-violet',
        'fa fa-truck': 'bg-green',
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

}

@Component({
    selector: 'recarga-factura',
    templateUrl: 'app/recarga/facturas.html',
    styleUrls: ['app/recarga/style.css'],
    inputs:['params'],
    pipes: [Fecha],
})
export class RecargaFactura extends RestController{
    // public params={
    //     'dateStart':'27-06-2016',
    //     'dateEnd':'27-06-2016',
    // };
    public params:any={};

    constructor(public http:Http,public _formBuilder: FormBuilder) {
        super(http);
        this.setEndpoint('/search/recharges/');
    }
    ngOnInit() {
        this.max = 10;
        this.cargar()
    }
    public cargar(){
        this.endpoint="/search/recharges/?where=[['op':'ge','field':'dateCreated','value':'"+this.params.dateStart+"','type':'date']," +
            "['op':'lt','field':'dateCreated','value':'"+this.params.dateEnd+"','type':'date']]";

        this.loadData();
    }
    loadData(offset=0){
        this.offset=offset;
        this.httputils.onLoadList(this.endpoint+`&max=${this.max}&offset=${this.offset}`,this.dataList,this.max,this.error);
    }
}