import { Component } from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import  {FormBuilder, Validators, Control} from '@angular/common';
import {RestController} from "../common/restController";

@Component({
    selector: 'tagRfid',
    templateUrl: 'app/tagRfid/tagRfid.html',
    styleUrls: ['app/tagRfid/tagRfid.css']
})
export class TagRfid extends RestController{

    vehicle: Control;
    number: Control;

    constructor(public router: Router,public http: Http,public _formBuilder: FormBuilder) {
        super(http);
        this.validTokens();
        this.setEndpoint('/rfids/');
        this.initForm();
        this.loadData();
    }
    initForm(){

        this.vehicle = new Control("", Validators.compose([Validators.required]));
        this.number = new Control("", Validators.compose([Validators.required]));

        this.form = this._formBuilder.group({
            vehicle: this.vehicle,
            number: this.number,
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