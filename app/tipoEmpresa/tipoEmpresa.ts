import { Component } from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import  {FormBuilder, Validators, Control, ControlGroup,} from '@angular/common';
import {HttpUtils} from "../common/http-utils";
import {RestController} from "../common/restController";

@Component({
    selector: 'tipoEmpresa',
    templateUrl: 'app/tipoEmpresa/tipoEmpresa.html',
    styleUrls: ['app/tipoEmpresa/tipoEmpresa.css']
})
export class TipoEmpresa extends RestController{

    title: Control;
    icon: Control;

    constructor(public router: Router,public http: Http,public _formBuilder: FormBuilder) {
        super(http);
        this.validTokens();
        this.setEndpoint('/type/companies/');
        this.initForm();
        this.loadData();
    }
    initForm(){

        this.title = new Control("", Validators.compose([Validators.required]));
        this.icon = new Control("", Validators.compose([Validators.required]));

        this.form = this._formBuilder.group({
            title: this.title,
            icon: this.icon,
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