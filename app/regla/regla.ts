import { Component } from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import  {FormBuilder, Validators, Control} from '@angular/common';
import {RestController} from "../common/restController";

@Component({
    selector: 'regla',
    templateUrl: 'app/regla/regla.html',
    styleUrls: ['app/regla/regla.css']
})
export class Regla extends RestController{

    rule: Control;
    name: Control;

    constructor(public router: Router,public http: Http,public _formBuilder: FormBuilder) {
        super(http);
        this.validTokens();
        this.setEndpoint('/rules/');
        this.initForm();
        this.loadData();
    }
    initForm(){

        this.rule = new Control("", Validators.compose([Validators.required]));
        this.name = new Control("", Validators.compose([Validators.required]));

        this.form = this._formBuilder.group({
            rule: this.rule,
            name: this.name,
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