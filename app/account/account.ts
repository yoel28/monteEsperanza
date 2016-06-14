import { Component } from '@angular/core';
import  {FormBuilder, Validators, Control, ControlGroup,} from '@angular/common';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import { contentHeaders } from '../common/headers';
import {RestController} from "../common/restController";


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

    constructor(router: Router,http: Http, _formBuilder: FormBuilder) {
        if(localStorage.getItem('bearer'))
        {
            let link = ['AccountLogin', {}];
            router.navigate(link);
        }
        super(router,http);
        this.setEndpoint("/users/");

        this.username = new Control("", Validators.compose([Validators.required]));
        this.password = new Control("", Validators.compose([Validators.required]));

        this.form = _formBuilder.group({
            username: this.username,
            password: this.password,
        });
    }

    login(event: Event) {
        event.preventDefault();
        let body =JSON.stringify(this.form.value);
        this.http.post(localStorage.getItem('urlAPI')+'/login', body, { headers: contentHeaders })
            .subscribe(
                response => {
                    localStorage.setItem('bearer',response.json().access_token);
                    contentHeaders.append('Authorization', 'Bearer '+localStorage.getItem('bearer'));
                    let link = ['Dashboard', {}];
                    this.router.navigate(link);
                },
                error => {
                    alert(error.text());
                    console.log(error.text());
                }
            );
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



