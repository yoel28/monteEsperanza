import { Component,EventEmitter } from '@angular/core';
import  {FormBuilder, Validators, Control, ControlGroup} from '@angular/common';
import {RestController} from "../common/restController";
import {Http} from "@angular/http";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {SELECT_DIRECTIVES} from "ng2-select/ng2-select";

@Component({
    selector: 'tipoVehiculo-save',
    templateUrl: 'app/tipoVehiculo/save.html',
    styleUrls: ['app/tipoVehiculo/style.css'],
    directives: [SELECT_DIRECTIVES],
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
        this.setEndpoint('/type/vehicles/');
        this.save = new EventEmitter();

    }
    ngOnInit(){
        this.initTipos();
        this.initForm();
    }
    public items:any = [];
    initTipos(){
        this.items=[
            {'id': 'fa fa-truck', 'text':'<i class="fa fa-truck"></i> Truck'},
            {'id': 'fa fa-car', 'text': '<i class="fa fa-car"></i> Car'},
            {'id': 'fa fa-bus', 'text': '<i class="fa fa-bus"></i> Bus'},
            {'id': 'fa fa-taxi', 'text': '<i class="fa fa-taxi"></i> Taxi'},
        ]
    }
    public refreshValue(value:any):void {
        this.icon.updateValue(value.id);
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

