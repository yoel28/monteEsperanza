import { Component,EventEmitter } from '@angular/core';
import  {FormBuilder, Validators, Control, ControlGroup} from '@angular/common';
import {RestController} from "../common/restController";
import {Http} from "@angular/http";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {Search} from "../utils/search/search"


@Component({
    selector: 'operacion-save',
    templateUrl: 'app/operacion/save.html',
    styleUrls: ['app/operacion/style.css'],
    inputs:['idModal'],
    outputs:['save'],
    directives:[Search],
})
export class OperacionSave extends RestController{

    public idModal:string;
    public save:any;

    form: ControlGroup;
    vehicle: Control;
    weightIn: Control;

    constructor(public _formBuilder: FormBuilder,public http:Http,public toastr: ToastsManager) {
        super(http,toastr);
        this.setEndpoint('/operations/');
        this.save = new EventEmitter();
    }
    ngOnInit(){
        this.initForm();
    }
    initForm(){
        this.vehicle = new Control("", Validators.compose([Validators.required]));
        this.weightIn = new Control("", Validators.compose([Validators.required]));

        this.form = this._formBuilder.group({
            vehicle: this.vehicle,
            weightIn: this.weightIn,
        });
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
