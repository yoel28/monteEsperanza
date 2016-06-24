import { Component,EventEmitter } from '@angular/core';
import  {FormBuilder, Validators, Control, ControlGroup} from '@angular/common';
import {RestController} from "../common/restController";
import {Http} from "@angular/http";

@Component({
    selector: 'operacion-save',
    templateUrl: 'app/operacion/save.html',
    styleUrls: ['app/operacion/style.css'],
    inputs:['idModal'],
    outputs:['save'],
})
export class OperacionSave extends RestController{

    public idModal:string;
    public save:any;

    form: ControlGroup;
    recharge: Control;
    vehicle: Control;
    weightIn: Control;
    weightOut: Control;

    constructor(public _formBuilder: FormBuilder,public http:Http) {
        super(http);
        this.setEndpoint('/operations/');
        this.initForm();
        this.save = new EventEmitter();
    }
    initForm(){
        this.recharge = new Control("", Validators.compose([Validators.required]));
        this.vehicle = new Control("", Validators.compose([Validators.required]));
        this.weightIn = new Control("", Validators.compose([Validators.required]));
        this.weightOut = new Control("", Validators.compose([Validators.required]));

        this.form = this._formBuilder.group({
            recharge: this.recharge,
            vehicle: this.vehicle,
            weightIn: this.weightIn,
            weightOut: this.weightOut,
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
