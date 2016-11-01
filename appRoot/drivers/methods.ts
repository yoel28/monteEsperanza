import {Component, EventEmitter, OnInit} from '@angular/core';
import  {FormBuilder, Validators, Control, ControlGroup} from '@angular/common';
import {RestController} from "../common/restController";
import {Http} from "@angular/http";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {SELECT_DIRECTIVES} from "ng2-select/ng2-select";
declare var SystemJS:any;

@Component({
    selector: 'drivers-save',
    templateUrl: SystemJS.map.app+'/drivers/save.html',
    styleUrls: [SystemJS.map.app+'/drivers/style.css'],
    directives: [SELECT_DIRECTIVES],
    inputs:['idModal'],
    outputs:['save'],
})
export class DriversSave extends RestController implements OnInit{

    public idModal:string;
    public save:any;

    form: ControlGroup;
    nombre: Control;
    telefono: Control;
    direccion: Control;
    email: Control;

    constructor(public http:Http,public _formBuilder: FormBuilder,public toastr?: ToastsManager) {
        super(http,toastr);
        this.setEndpoint('/drivers/');
        this.save = new EventEmitter();

    }
    ngOnInit(){
        this.initForm();
    }

    initForm(){

        this.nombre = new Control("", Validators.compose([Validators.required,Validators.maxLength(35)]));
        this.telefono = new Control("", Validators.compose([Validators.required]));
        this.direccion = new Control("", Validators.compose([Validators.required]));
        this.email = new Control("", Validators.compose([Validators.required]));

        this.form = this._formBuilder.group({
            nombre: this.nombre,
            telefono: this.telefono,
            direccion: this.direccion,
            email: this.email,

        });

    }

    submitForm(){
        let that = this;
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

