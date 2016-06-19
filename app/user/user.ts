import { Component } from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http} from '@angular/http';
import  {FormBuilder, Validators, Control} from '@angular/common';
import {RestController} from "../common/restController";
import {globalService} from "../common/globalService";

@Component({
    selector: 'user',
    templateUrl: 'app/user/user.html',
    styleUrls: [
        'app/user/user.css'
    ],

})
export class User extends RestController{

    username: Control;
    name: Control;
    email: Control;
    password: Control;
    phone: Control;

    constructor(public router: Router,public http: Http,public _formBuilder: FormBuilder,public myglobal:globalService) {
        super(http);
        this.validTokens();
        this.setEndpoint('/users/');
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

        this.username = new Control("", Validators.compose([Validators.required]));
        this.name = new Control("", Validators.compose([Validators.required]));
        this.email = new Control("", Validators.compose([Validators.required]));
        this.password = new Control("", Validators.compose([Validators.required]));
        this.phone = new Control("", Validators.compose([Validators.required]));

        this.form = this._formBuilder.group({
            username: this.username,
            name: this.name,
            email: this.email,
            password: this.password,
            phone: this.phone,
        });

    }
    goTaquilla(companyRuc:string)
    {
        let link = ['TaquillaSearh', {search:companyRuc}];
        this.router.navigate(link);
    }

}