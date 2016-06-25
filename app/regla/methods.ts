import { Component,EventEmitter } from '@angular/core';
import  {FormBuilder, Validators, Control, ControlGroup} from '@angular/common';
import {RestController} from "../common/restController";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {Http} from "@angular/http";

@Component({
    selector: 'regla-save',
    templateUrl: 'app/regla/save.html',
    styleUrls: ['app/regla/style.css'],
    inputs:['idModal'],
    outputs:['save'],
})
export class ReglaSave extends RestController{

    public idModal:string;
    public save:any;

    form: ControlGroup;
    rule: Control;
    name: Control;


    constructor(public _formBuilder: FormBuilder,public http:Http,public toastr: ToastsManager) {
        super(http,toastr);
        this.setEndpoint('/rules/');
        this.initForm();
        this.save = new EventEmitter();
    }
    initForm(){
        this.rule = new Control("", Validators.compose([Validators.required]));
        this.name = new Control("", Validators.compose([Validators.required]));

        this.form = this._formBuilder.group({
            rule: this.rule,
            name: this.name,
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

