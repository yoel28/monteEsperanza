import { Component,EventEmitter } from '@angular/core';
import  {FormBuilder, Validators, Control, ControlGroup} from '@angular/common';
import {SELECT_DIRECTIVES} from 'ng2-select/ng2-select';
import {RestController} from "../common/restController";
import {Http} from "@angular/http";
import {ToastsManager} from "ng2-toastr/ng2-toastr";

declare var SystemJS:any;

@Component({
    selector: 'parametro-save',
    templateUrl: SystemJS.map.app+'/parametro/save.html',
    styleUrls: [SystemJS.map.app+'/parametro/style.css'],
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
    detail: Control;
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
        this.detail = new Control("");

        this.form = this._formBuilder.group({
            key: this.key,
            value: this.value,
            type: this.type,
            detail: this.detail,
        });
    }
    public items:any=['String','Long','Double','Date'];

    public refreshValue(value:any):void {
        this.type.updateValue(value.id);
    }

    submitForm(){
        let that=this;
        let successCallback= response => {
            that.resetForm();
            that.save.emit(response.json());
            that.toastr.success('Guardado con éxito','Notificación')
        };
        let body = JSON.stringify(this.form.value);
        this.httputils.doPost(this.endpoint,body,successCallback,this.error);
    }
    resetForm(){
        let that=this;
        Object.keys(this).forEach(key=>{
            if(that[key] instanceof Control){
                that[key].updateValue(null);
                that[key].setErrors(null);
                that[key]._pristine=true;
            }
        })
    }
}

