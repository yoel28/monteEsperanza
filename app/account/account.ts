import {Component} from '@angular/core';
import  {FormBuilder, Validators, Control, ControlGroup} from '@angular/common';
import {Router, RouteParams}           from '@angular/router-deprecated';
import {Http} from '@angular/http';
import {contentHeaders} from '../common/headers';
import {RestController} from "../common/restController";
import {globalService} from "../common/globalService";
import {ToastsManager} from "ng2-toastr/ng2-toastr";


//--------------------------LOGIN-------------------------------
@Component({
    selector: 'login',
    templateUrl: 'app/account/login/index.html',
    styleUrls: ['app/account/style.css']
})
export class AccountLogin extends RestController {

    public submitForm:boolean = false;
    form:ControlGroup;
    username:Control;
    password:Control;

    constructor(public router:Router, public http:Http, public _formBuilder:FormBuilder, public myglobal:globalService,public toastr: ToastsManager) {
        super(http);
        this.validTokens();
        this.setEndpoint("/login");
        this.initForm();
    }

    initForm() {

        this.username = new Control("", Validators.compose([Validators.required]));
        this.password = new Control("", Validators.compose([Validators.required]));

        this.form = this._formBuilder.group({
            username: this.username,
            password: this.password,
        });
    }

    validTokens() {
        if (localStorage.getItem('bearer')) {
            let link = ['Dashboard', {}];
            this.router.navigate(link);
        }
    }

    login(event:Event) {
        event.preventDefault();
        let body = JSON.stringify(this.form.value);
        this.submitForm = true;
        let errorLogin = error=> {
            this.submitForm = false;
            this.toastr.error('Usuario o contraseña invalida');
        }
        let successCallback = response => {
            this.submitForm = false;
            localStorage.setItem('bearer', response.json().access_token);
            contentHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('bearer'));
            this.myglobal.user = response.json();
            let link = ['Dashboard', {}];
            this.router.navigate(link);
        };
        this.httputils.doPost(this.endpoint, body, successCallback, errorLogin);
    }
    recover(){
        let link = ['AccountRecover', {}];
        this.router.navigate(link);
    }

}
//-----------------------ACTIVAR------------------------------
@Component({
    selector: 'activate',
    templateUrl: 'app/account/activate/index.html',
    styleUrls: ['app/account/style.css']
})
export class AccountActivate extends RestController {
    mensaje:string;

    constructor(public params:RouteParams, public router:Router, public http:Http) {
        super(http);
        this.setEndpoint('/users/activate/' + params.get('id') + "?access_token=" + params.get('token'));
        this.validate();
    }
    validate() {
        let successCallback = response => {
            this.mensaje = "Cuenta Activada";
        }
        let errorCallback = err => {
            this.mensaje = "Error al activar la cuenta";
        }
        this.httputils.doGet(this.endpoint, successCallback, errorCallback)
    }
    onLogin(){
        let link = ['AccountLogin', {}];
        this.router.navigate(link);
    }
}
//-------------------------Recover-------------------------
@Component({
    selector: 'recover',
    templateUrl: 'app/account/recover/index.html',
    styleUrls: ['app/account/style.css']
})
export class AccountRecover extends RestController {

    form:ControlGroup;
    username:Control;

    constructor(public router:Router, public http:Http, public _formBuilder:FormBuilder) {
        super(http);
        this.setEndpoint('/users/recover/');
        this.initForm();
    }
    initForm() {
        this.username = new Control("", Validators.compose([Validators.required]));
        this.form = this._formBuilder.group({
            username: this.username,
        });
    }

    recoverPassword(){

    }
    onLogin(){
        let link = ['AccountLogin', {}];
        this.router.navigate(link);
    }
}
//-------------------------Recover Password-------------------------
@Component({
    selector: 'recoverPassword',
    templateUrl: 'app/account/recoverPassword/index.html',
    styleUrls: ['app/account/style.css']
})
export class AccountRecoverPassword extends RestController {

    form:ControlGroup;
    password:Control;

    constructor(public params:RouteParams, public router:Router, public http:Http, public _formBuilder:FormBuilder) {
        super(http);
        this.setEndpoint('/users/recoverPassword/' + params.get('id') + "?access_token=" + params.get('token'));
        this.initForm();
    }
    initForm() {
        this.password = new Control("", Validators.compose([Validators.required,Validators.minLength(4)]));
        this.form = this._formBuilder.group({
            password: this.password,
        });
    }

    onLogin(){
        let link = ['AccountLogin', {}];
        this.router.navigate(link);
    }
}

