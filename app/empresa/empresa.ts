import { Component } from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import  {FormBuilder, Validators, Control} from '@angular/common';
import {RestController} from "../common/restController";

//--------------------------LOGIN-------------------------------
@Component({
    selector: 'empresa',
    templateUrl: 'app/empresa/empresa.html',
    styleUrls: ['app/empresa/empresa.css']
})
export class Empresa extends RestController{

    

    constructor(public router: Router,public http: Http,public _formBuilder: FormBuilder) {
        super(http);
        this.validTokens();
        this.setEndpoint('/empresas/');
        this.initForm();
        this.loadData();
    }
    validTokens(){
        if(!localStorage.getItem('bearer'))
        {
            let link = ['AccountLogin', {}];
            this.router.navigate(link);
        }
    }
    initForm(){

    }

}