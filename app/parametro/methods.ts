import { Component,EventEmitter } from '@angular/core';
import  {FormBuilder, Validators, Control, ControlGroup} from '@angular/common';
import {SELECT_DIRECTIVES} from 'ng2-select/ng2-select';
import {RestController} from "../common/restController";
import {Http} from "@angular/http";
import {ToastsManager} from "ng2-toastr/ng2-toastr";


@Component({
    selector: 'parametro-save',
    templateUrl: 'app/parametro/save.html',
    styleUrls: ['app/parametro/style.css'],
    inputs:['idModal'],
    directives:[SELECT_DIRECTIVES],
    outputs:['save'],
})
export class ParametroSave extends RestController{

    public idModal:string;
    public save:any;

    form: ControlGroup;
    key: Control;
    value: Control;
    type: Control;

    constructor(public http:Http,public _formBuilder: FormBuilder,public toastr: ToastsManager) {
        super(http,toastr);
        this.setEndpoint('/params/');
        this.initForm();
        this.save = new EventEmitter();
    }
    initForm(){
        this.key = new Control("", Validators.compose([Validators.required]));
        this.value = new Control("", Validators.compose([Validators.required]));
        this.type = new Control("", Validators.compose([Validators.required]));

        this.form = this._formBuilder.group({
            key: this.key,
            value: this.value,
            type: this.type,
        });
    }
    public items:any=['String','Long','Double','Date'];

    public refreshValue(value:any):void {
        this.type.updateValue(value.id);
    }

    submitForm(){
        let successCallback= response => {
            this.save.emit(response.json());
            this.toastr.success('Guardado con éxito','Notificación')
        };
        let body = JSON.stringify(this.form.value);
        this.httputils.doPost(this.endpoint,body,successCallback,this.error);
    }
}

