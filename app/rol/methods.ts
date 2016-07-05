import { Component,EventEmitter } from '@angular/core';
import  {FormBuilder, Validators, Control, ControlGroup} from '@angular/common';
import {SELECT_DIRECTIVES} from 'ng2-select/ng2-select';
import {RestController} from "../common/restController";
import {Http} from "@angular/http";
import {ToastsManager} from "ng2-toastr/ng2-toastr";


@Component({
    selector: 'rol-save',
    templateUrl: 'app/rol/save.html',
    styleUrls: ['app/rol/style.css'],
    inputs:['idModal'],
    directives:[SELECT_DIRECTIVES],
    outputs:['save'],
})
export class RolSave extends RestController{

    public idModal:string;
    public save:any;

    form: ControlGroup;
    authority: Control;
    enabled: Control;

    constructor(public http:Http,public _formBuilder: FormBuilder,public toastr: ToastsManager) {
        super(http,toastr);
        this.setEndpoint('/roles/');
        this.initForm();
        this.save = new EventEmitter();
    }
    initForm(){
        this.authority = new Control("", Validators.compose([Validators.required]));
        this.enabled = new Control("", Validators.compose([Validators.required]));

        this.form = this._formBuilder.group({
            authority: this.authority,
            enabled: this.enabled,
        });
    }
    submitForm(){
        let successCallback= response => {
            this.save.emit(response.json());
        };
        this.authority.updateValue("ROLE_"+this.authority.value.toUpperCase())
        let body = JSON.stringify(this.form.value);
        this.httputils.doPost(this.endpoint,body,successCallback,this.error);
    }
    //Opciones de habilitar
    public items:any=[{id:true,text:"Habilitado"},{id:false,text:"Deshabilitado"}];

    public refreshValue(value:any):void {
        if(value.id)
            this.enabled.updateValue(value.id);
    }
}


