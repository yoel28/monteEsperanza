import { Component,EventEmitter } from '@angular/core';
import  {FormBuilder, Validators, Control, ControlGroup} from '@angular/common';
import {SELECT_DIRECTIVES} from 'ng2-select/ng2-select';
import {RestController} from "../common/restController";
import {Http} from "@angular/http";
import {ToastsManager} from "ng2-toastr/ng2-toastr";


@Component({
    selector: 'permiso-save',
    templateUrl: 'app/permiso/save.html',
    styleUrls: ['app/permiso/style.css'],
    inputs:['idModal'],
    directives:[SELECT_DIRECTIVES],
    outputs:['save'],
})
export class PermisoSave extends RestController{

    public idModal:string;
    public save:any;

    form: ControlGroup;
    title: Control;
    detail: Control;
    module: Control;

    constructor(public http:Http,public _formBuilder: FormBuilder,public toastr: ToastsManager) {
        super(http,toastr);
        this.setEndpoint('/permissions/');
        this.initForm();
        this.save = new EventEmitter();
    }
    initForm(){
        this.title = new Control("", Validators.compose([Validators.required]));
        this.detail = new Control("", Validators.compose([Validators.required]));
        this.module = new Control("", Validators.compose([Validators.required]));

        this.form = this._formBuilder.group({
            title: this.title,
            detail: this.detail,
            module: this.module,
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

