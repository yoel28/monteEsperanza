import { Component } from '@angular/core';
import  {FormBuilder, Validators, Control, ControlGroup} from '@angular/common';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import { contentHeaders } from '../common/headers';
import {RestController} from "../common/restController";
import {globalService} from "../common/globalService";



//--------------------------LOGIN-------------------------------
@Component({
    selector: 'login',
    templateUrl: 'app/account/login/login.html',
    styleUrls: ['app/account/login/login.css']
})
export class AccountLogin extends RestController{

    form: ControlGroup;
    username: Control;
    password: Control;

    constructor(public router: Router,public http: Http,public _formBuilder: FormBuilder,public myglobal:globalService) {
        super(http);
        this.validTokens();
        this.setEndpoint("/login");
        this.initForm();
    }
    initForm(){

        this.username = new Control("", Validators.compose([Validators.required]));
        this.password = new Control("", Validators.compose([Validators.required]));

        this.form = this._formBuilder.group({
            username: this.username,
            password: this.password,
        });
    }

    validTokens(){
        if(localStorage.getItem('bearer'))
        {
            let link = ['Dashboard', {}];
            this.router.navigate(link);
        }
    }

    login(event: Event) {
        event.preventDefault();
        let body =JSON.stringify(this.form.value);
        let successCallback= response => {
            localStorage.setItem('bearer',response.json().access_token);
            contentHeaders.append('Authorization', 'Bearer '+localStorage.getItem('bearer'));
            this.myglobal.user = response.json();
            let link = ['Dashboard', {}];
            this.router.navigate(link);
        };
        this.httputils.doPost(this.endpoint,body,successCallback,this.error);
    }
}

//------------------------------SIGNUP------------------------------
@Component({
    selector: 'signup',
    templateUrl: 'app/account/signup/signup.html',
    styleUrls: ['app/account/signup/signup.css']
})
export class AccountSignup {

    public token:boolean = false;
    public data:any;

    constructor(private router: Router,public http: Http) {
        if(localStorage.getItem('bearer'))
        {
            let link = ['Dashboard', {}];
            this.router.navigate(link);
        }
    }

    signup(event, username, password,email,phone,name) {
        event.preventDefault();
        let body = JSON.stringify({ username, password,email,phone,name});
        this.http.post('http://ec2-54-197-11-239.compute-1.amazonaws.com:8080/user/save', body, { headers: contentHeaders })
            .subscribe(
                response => {
                    this.data = response.json();
                },
                error => {
                    alert(error.text());
                    console.log(error.text());
                }
            );
    }
}



