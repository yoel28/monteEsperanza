import {Component, EventEmitter, Input} from '@angular/core';
import  {FormBuilder, Validators, Control, ControlGroup} from '@angular/common';
import {Http} from "@angular/http";
import {RestController} from "../common/restController";
import {SELECT_DIRECTIVES} from 'ng2-select/ng2-select';


@Component({
    selector: 'recarga-save',
    templateUrl: 'app/recarga/save.html',
    styleUrls: ['app/recarga/style.css'],
    directives: [SELECT_DIRECTIVES],
    outputs:['save'],
})
export class RecargaSave extends RestController{

    @Input() idModal:string;
    @Input() idVehicle:string;

    public save:any;

    form: ControlGroup;
    vehicle: Control;
    quantity: Control;
    reference: Control;
    referenceDate: Control;
    rechargeType: Control;



    rechargeTypes:any = []; //Arreglo con todos los tipos de regarga

    constructor(public http:Http,public _formBuilder: FormBuilder) {
        super(http);
        this.setEndpoint('/recharges/');
        this.getRechargeTypes();
        this.initForm();
        this.save = new EventEmitter();
    }

    initForm(){

        this.quantity = new Control("", Validators.compose([Validators.required]));
        this.vehicle = new Control("", Validators.compose([Validators.required]));
        this.reference = new Control("", Validators.compose([Validators.required]));
        this.referenceDate = new Control("", Validators.compose([Validators.required]));
        this.rechargeType = new Control("", Validators.compose([Validators.required]));

        this.form = this._formBuilder.group({
            quantity: this.quantity,
            reference: this.reference,
            referenceDate: this.referenceDate,
            vehicle: this.vehicle,
            rechargeType: this.rechargeType,
        });
    }
    setRechargeType(id){
        this.rechargeType.updateValue(id);
    }
    getRechargeTypes(){
        this.httputils.onLoadList("/type/recharges?where=[['op':'ne','field':'enabled','value':false]]",this.rechargeTypes,this.error);
    }
    submitForm(){
        let successCallback= response => {
            this.save.emit(response.json());
        };
        let body = JSON.stringify(this.form.value);
        this.httputils.doPost(this.endpoint,body,successCallback,this.error);
    }

}


