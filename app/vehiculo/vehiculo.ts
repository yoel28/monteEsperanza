import {Component, ElementRef, Directive,EventEmitter} from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http} from '@angular/http';
import {RestController} from "../common/restController";
import {VehiculoSave} from "./methods";
import {EmpresaSave} from "../empresa/methods";
import {TipoVehiculoSave} from "../tipoVehiculo/methods";
import {TagSave} from "../tagRfid/methods";
import {Search} from "../utils/search/search"
import {Json} from "@angular/platform-browser/src/facade/lang";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {Control, FormBuilder, ControlGroup} from "@angular/common";



declare var jQuery:any;
@Directive({
    selector: "[x-editable]",
    inputs:['data','rules','field','xEndpoint'],
    outputs:['success']
})
export class Xeditable extends RestController{
    public success :any;
    public data:any={};
    public rules:any={};
    public field:string;
    public xEndpoint:any;
    
    constructor(public el: ElementRef,public http: Http,public toastr: ToastsManager) {
        super(http,toastr);
        this.success= new EventEmitter();
    }
    ngOnInit(){
        let that = this;
        this.setEndpoint(this.xEndpoint);
        jQuery(this.el.nativeElement).editable({
            type: that.rules[that.field].type || 'text',
            value: that.data[that.field] || "N/A",
            disabled: that.rules[that.field].disabled? that.rules[that.field].disabled : ( that.data.enabled? !that.data.enabled:false),
            display: that.rules[that.field].display || null,
            showbuttons:false,
            validate: function( newValue) {
                let val=that.success.emit([that.field, that.data, newValue]);
                return  val;
             // return  that.onPatch(that.field,that.data,newValue);
            }
        });
    }
}

@Component({
    selector: 'vehiculo',
    templateUrl: 'app/vehiculo/index.html',
    styleUrls: ['app/vehiculo/style.css'],
    directives: [VehiculoSave,Search,TagSave,TipoVehiculoSave,EmpresaSave,Xeditable],
})
export class Vehiculo extends RestController{

    public rules={
        'id': {'type':'text','disabled':true,'display':false,'title':'' },
        'plate':{'type':'text','display':null,'title':'Placa del vehiculo' },
        'weight':{'type':'number','display':null,'title':'Peso del vehiculo' },
        'minBalance':{'disabled':false,'display':null,'title':'Balance minimo' },
        'balance':{'type':'number','display':null,'title':'B' },
    }

    constructor(public router: Router,public http: Http,public toastr: ToastsManager,public _formBuilder: FormBuilder) {
        super(http,toastr);
        this.validTokens();
        this.setEndpoint('/vehicles/');
        this.loadData();
    }

    validTokens(){
        if(!localStorage.getItem('bearer'))
        {
            let link = ['AccountLogin', {}];
            this.router.navigate(link);
        }
    }
    assignVehiculo(data){
         this.dataList.list.push(data);
    }
    
    onPatch(event){
        return super.onPatch(event[0],event[1],event[2])
    }

    //Buscar tag sin vehiculo ---------------------------------------------
    public dataSelect:string;

    public searchTag={
        title:"Tag",
        idModal:"searchTag",
        endpointForm:"/search/rfids/",
        placeholderForm:"Seleccione un Tag",
        labelForm:{name:"Numero: ",detail:"Detalle: "},
        where:"&where=[['op':'isNull','field':'vehicle.id']]"
    }
    //asignar tag a vehiculo
    assignTag(data){
        let successCallBack = response=>{
            let index = this.dataList.list.findIndex(obj => obj.id == this.dataSelect);
            this.dataList.list[index].tagRFID = response.json().number;
            this.dataList.list[index].tagId = response.json().id;
        }
        let body=Json.stringify({'vehicle':this.dataSelect})
        this.httputils.doPut('/rfids/'+data.id,body,successCallBack,this.error)
    }
    //liberar tag
    releaseTag(data){
        let successCallback= response => {
            data.tagRFID=null;
        };
        let body = JSON.stringify({'vehicle':null})
        this.httputils.doPut('/rfids/'+data.tagId,body,successCallback,this.error)
    }
    //asignar tag nuevo
    assignTagNuevo(data){
        let index = this.dataList.list.findIndex(obj => obj.id == this.dataSelect);
        if(this.dataList.list[index].tagRFID)
        {
            let successCallback= response => {
                this.assignTag(data);
            };
            let body = JSON.stringify({'vehicle':null})
            this.httputils.doPut('/rfids/'+this.dataList.list[index].tagId,body,successCallback,this.error)
        }
        else
            this.assignTag(data);
    }


    //Buscar tipo vehiculo ---------------------------------------------
    public searchTipoVehiculo={
        title:"Tipo Vehiculo",
        idModal:"searchTipoVehiculo",
        endpointForm:"/search/type/vehicles",
        placeholderForm:"Seleccione un Tipo de vehiculo",
        labelForm:{name:"Numero: ",detail:"Detalle: "}
    }
    //asignar tag a vehiculo
    assignTipoVehiculo(data){
        let successCallBack = response=>{
            let index = this.dataList.list.findIndex(obj => obj.id == this.dataSelect);
            this.dataList.list[index] = response.json();
        }
        let body=Json.stringify({'vehicleType':data.id})
        this.httputils.doPut('/vehicles/'+this.dataSelect,body,successCallBack,this.error)
    }

    //Buscar Empresa ---------------------------------------------
    public searchEmpresa={
        title:"Empresa Nueva",
        idModal:"searchEmpresaNueva",
        endpointForm:"/search/companies/",
        placeholderForm:"Ingrese el RUC de la empresa",
        labelForm:{name:"Nombre: ",detail:"RUC: "},
    }
    //asignar empresa
    assignEmpresa(data){
        let successCallBack = response=>{
            let index = this.dataList.list.findIndex(obj => obj.id == this.dataSelect);
            this.dataList.list[index] = response.json();
        }
        let body=Json.stringify({'company':data.id})
        this.httputils.doPut('/vehicles/'+this.dataSelect,body,successCallBack,this.error)
    }

}