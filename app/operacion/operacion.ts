import { Component } from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import  {FormBuilder, Validators, Control, ControlGroup,} from '@angular/common';
import {HttpUtils} from "../common/http-utils";
import {RestController} from "../common/restController";

@Component({
    selector: 'operacion',
    templateUrl: 'app/operacion/operacion.html',
    styleUrls: ['app/operacion/operacion.css']
})
export class Operacion extends RestController{

    recharge: Control;
    vehicle: Control;
    weightIn: Control;
    weightOut: Control;
    
    
    constructor(public router: Router,public http: Http, public _formBuilder: FormBuilder) {
        super(http);
        this.validTokens();
        this.setEndpoint('/operations/');
        this.initForm();
        this.loadData();
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
    validTokens(){
        if(!localStorage.getItem('bearer'))
        {
            let link = ['AccountLogin', {}];
            this.router.navigate(link);
        }
    }
    
}