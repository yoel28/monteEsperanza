import {Component, ViewChild} from '@angular/core';
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
import {FormBuilder} from "@angular/common";
import {Xeditable, Xfile, Xcropit} from "../common/xeditable";
import {Divide} from "../utils/pipe";
import {globalService} from "../common/globalService";

declare var jQuery:any;
@Component({
    selector: 'vehiculo',
    pipes:[Divide],
    templateUrl: 'app/vehiculo/index.html',
    styleUrls: ['app/vehiculo/styleVehiculo.css'],
    directives: [VehiculoSave,Search,TagSave,TipoVehiculoSave,EmpresaSave,Xeditable,Xcropit,Xfile],
})
export class Vehiculo extends RestController{

    @ViewChild(Search)
    modal:Search;

    public rules={
        'id': {'type':'text','disabled':true,'display':false,'title':'' },
        'plate':{'type':'text','display':null,'title':'Placa del vehiculo' },
        'weight':{'type':'number','display':null,'title':'Peso del vehiculo' },
        'minBalance':{'disabled':false,'display':null,'title':'Balance minimo' },
        'balance':{'type':'number','display':null,'title':'B' },
    }

    constructor(public router: Router,public http: Http,public toastr: ToastsManager,public _formBuilder: FormBuilder,public myglobal:globalService) {
        super(http,toastr);
        this.setEndpoint('/vehicles/');
    }
    ngOnInit(){
        this.max = 12;
        this.validTokens();
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
        this.dataList.list.unshift(data);
        this.dataList.list.pop();
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
            this.modal.dataList=[];
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
            this.modal.dataList=[];
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
            this.modal.dataList=[];
        }
        let body=Json.stringify({'company':data.id})
        this.httputils.doPut('/vehicles/'+this.dataSelect,body,successCallBack,this.error)
    }

    //cambiar imagen
    public image:any=[];
    changeImage(data,id){
        if(this.image[id]==null)
            this.image[id]=[];
        this.image[id]=data;
    }
    loadImage(event,user){
        event.preventDefault();
        this.onPatch('image',user,this.image[user.id]);
    }

}