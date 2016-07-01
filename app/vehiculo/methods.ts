import { Component,EventEmitter } from '@angular/core';
import  {FormBuilder, Validators, Control, ControlGroup} from '@angular/common';
import {RestController} from "../common/restController";
import {Http} from "@angular/http";
import {SELECT_DIRECTIVES} from 'ng2-select/ng2-select';
import {Search} from "../utils/search/search";
import {ImageUpload, ResizeOptions, ImageResult} from "ng2-imageupload/index";


@Component({
    selector: 'vehiculo-save',
    templateUrl: 'app/vehiculo/save.html',
    styleUrls: ['app/vehiculo/style.css'],
    inputs:['idModal'],
    outputs:['save'],
    directives:[SELECT_DIRECTIVES,Search,ImageUpload]

})
export class VehiculoSave extends RestController{

    public idModal:string;
    public save:any;

    form: ControlGroup;

    plate: Control;
    minBalance: Control;
    weight: Control;
    vehicleType: Control;
    company: Control;
    image: Control;


    dataCompany:string;


    constructor(public http:Http,public _formBuilder: FormBuilder) {
        super(http);
        this.initForm();
        this.save = new EventEmitter();
        this.setEndpoint('/vehicles/');
        this.loadDataVehicleTypes();
    }
    initForm(){

        this.plate = new Control("", Validators.compose([Validators.required]));
        this.minBalance = new Control("", Validators.compose([Validators.required]));
        this.weight = new Control("", Validators.compose([Validators.required]));
        this.vehicleType = new Control("", Validators.compose([Validators.required]));
        this.company = new Control("", Validators.compose([Validators.required]));
        this.image = new Control("", Validators.compose([Validators.required]));

        this.form = this._formBuilder.group({
            plate: this.plate,
            minBalance: this.minBalance,
            weight: this.weight,
            vehicleType: this.vehicleType,
            company: this.company,
            image: this.image,
        });

    }
    submitForm(){
        let successCallback= response => {
            this.save.emit(response.json());
            
        };
        let body = JSON.stringify(this.form.value);
        this.httputils.doPost(this.endpoint,body,successCallback,this.error);
    }

    //cargar data tipo de vehiculos
    public items:any = [];
    public vehicleTypes:any=[];
    //rfids?where[['op':'isNull','field':'vehicle']]

    loadDataVehicleTypes(){
        let successCallback= response => {
            Object.assign(this.vehicleTypes, response.json());
            this.vehicleTypes.list.forEach(obj=>{
                let icon = obj.icon?obj.icon:'fa fa-building-o';
                this.items.push({id:obj.id,text:"<i class='"+icon+"'></i> <strong>"+obj.title+"</strong> "+obj.detail});
            });
        };
        this.httputils.doGet('/search/type/vehicles/',successCallback,this.error);
    }
    public refreshValue(value:any):void {
        this.vehicleType.updateValue(value.id);
    }

    //cargar data de empresas disponibles.
    public searchEmpresa={
        title:"Empresa",
        idModal:"searchEmpresa",
        endpointForm:"/search/companies/",
        placeholderForm:"Ingrese el RUC de la empresa",
        labelForm:{name:"Nombre: ",detail:"RUC: "},
    }
    assignCompany(data){
        this.company.updateValue(data.id);
        this.dataCompany=data.title+", RUC: "+data.detail;
    }
    //----------imagen------------------------------------------------
    src: string = "";
    resizeOptions: ResizeOptions = {
        resizeMaxHeight: 60,
        resizeMaxWidth: 60
    };

    selected(imageResult: ImageResult) {
        this.src = imageResult.resized
            && imageResult.resized.dataURL
            || imageResult.dataURL;
        this.image.updateValue(this.src);
    }

}

