import { Component,EventEmitter } from '@angular/core';
import  {FormBuilder, Validators, Control, ControlGroup} from '@angular/common';
import {SELECT_DIRECTIVES} from 'ng2-select/ng2-select';
import {RestController} from "../common/restController";
import {Http} from "@angular/http";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
declare var SystemJS:any;

@Component({
    selector: 'rol-save',
    templateUrl: SystemJS.map.app+'/rol/save.html',
    styleUrls: [SystemJS.map.app+'/rol/style.css'],
    inputs:['idModal'],
    directives:[SELECT_DIRECTIVES],
    outputs:['save'],
})
export class RolSave extends RestController{

    public idModal:string;
    public save:any;

    form: ControlGroup;
    authority: Control;

    constructor(public http:Http,public _formBuilder: FormBuilder,public toastr: ToastsManager) {
        super(http,toastr);
        this.setEndpoint('/roles/');
        this.initForm();
        this.save = new EventEmitter();
    }
    initForm(){
        this.authority = new Control("", Validators.compose([Validators.required]));
        this.form = this._formBuilder.group({
            authority: this.authority,
        });
    }
    submitForm(){
        let that = this;
        let successCallback= response => {
            that.resetForm();
            that.save.emit(response.json());
        };
        this.authority.updateValue("ROLE_"+this.authority.value.toUpperCase())
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

