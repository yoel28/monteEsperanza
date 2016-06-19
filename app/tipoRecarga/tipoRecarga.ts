import { Component } from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import  {FormBuilder, Validators, Control} from '@angular/common';
import {RestController} from "../common/restController";

@Component({
    selector: 'tipoRecarga',
    templateUrl: 'app/tipoRecarga/tipoRecarga.html',
    styleUrls: ['app/tipoRecarga/tipoRecarga.css']
})
export class TipoRecarga extends RestController{

    title: Control;
    detail: Control;
    icon: Control;

    constructor(public router: Router,public http: Http,public _formBuilder: FormBuilder) {
        super(http);
        this.validTokens();
        this.setEndpoint('/type/recharges/');
        this.initForm();
        this.loadData();
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
    validTokens(){
        if(!localStorage.getItem('bearer'))
        {
            let link = ['AccountLogin', {}];
            this.router.navigate(link);
        }
    }
}