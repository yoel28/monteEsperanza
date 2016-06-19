import { Component } from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import  {FormBuilder, Validators, Control} from '@angular/common';
import {RestController} from "../common/restController";

@Component({
    selector: 'parametro',
    templateUrl: 'app/parametro/parametro.html',
    styleUrls: ['app/parametro/parametro.css']
})
export class Parametro extends RestController{

    key: Control;
    value: Control;
    type: Control;

    constructor(public router: Router,public http: Http,public _formBuilder: FormBuilder) {
        super(http);
        this.validTokens();
        this.setEndpoint('/params/');
        this.initForm();
        this.loadData();
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
    validTokens(){
        if(!localStorage.getItem('bearer'))
        {
            let link = ['AccountLogin', {}];
            this.router.navigate(link);
        }
    }
}