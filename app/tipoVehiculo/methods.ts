import { Component,EventEmitter } from '@angular/core';
import  {FormBuilder, Validators, Control, ControlGroup} from '@angular/common';
import {RestController} from "../common/restController";
import {Http} from "@angular/http";
import {ToastsManager} from "ng2-toastr/ng2-toastr";

@Component({
    selector: 'tipoVehiculo-save',
    templateUrl: 'app/tipoVehiculo/save.html',
    styleUrls: ['app/tipoVehiculo/style.css'],
    inputs:['idModal'],
    outputs:['save'],
})
export class TipoVehiculoSave extends RestController{

    public idModal:string;
    public save:any;

    form: ControlGroup;
    title: Control;
    detail: Control;
    icon: Control;


    constructor(public http:Http,public _formBuilder: FormBuilder,public toastr?: ToastsManager) {
        super(http,toastr);
        this.initForm();
        this.setEndpoint('/type/vehicles/');
        this.save = new EventEmitter();

    }
    initForm(){

        this.title = new Control("", Validators.compose([Validators.required]));
        this.detail = new Control("", Validators.compose([Validators.required]));
        this.icon = new Control("", Validators.compose([Validators.required]));

        this.form = this._formBuilder.group({
            title: this.title,
            icon: this.icon,
            detail: this.detail,
        });

    }

    submitForm(){
        let successCallback= response => {
            this.save.emit(response.json());
        };
        let body = JSON.stringify(this.form.value);
        this.httputils.doPost(this.endpoint,body,successCallback,this.error);
    }
}

