import {Component, OnInit} from '@angular/core';
import  {FormBuilder, Validators, Control, ControlGroup} from '@angular/common';
import {Router, RouteParams}           from '@angular/router-deprecated';
import {Http} from '@angular/http';
import {contentHeaders} from '../common/headers';
import {RestController} from "../common/restController";
import {globalService} from "../common/globalService";
import {ToastsManager} from "ng2-toastr/ng2-toastr";

declare var SystemJS:any;
//--------------------------LOGIN-------------------------------
@Component({
    selector: 'login',
    templateUrl: SystemJS.map.app+'/account/login/index.html',
    styleUrls: [SystemJS.map.app+'/account/style.css']
})
export class AccountLogin extends RestController implements OnInit{

    public submitForm:boolean = false;
    form:ControlGroup;
    username:Control;
    password:Control;

    constructor(public router:Router, public http:Http, public _formBuilder:FormBuilder, public myglobal:globalService,public toastr: ToastsManager) {
        super(http);
        this.setEndpoint("/login");
    }
    ngOnInit(){
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
    
    login(event:Event) {
        event.preventDefault();
        let that=this;
        let body = JSON.stringify(this.form.value);
        this.submitForm = true;
        let errorLogin = error=> {
            that.submitForm = false;
            that.toastr.error('Usuario o contraseña inválida');
        }
        let successCallback = response => {
            that.submitForm = false;
            that.myglobal.init=false;
            localStorage.setItem('bearer', response.json().access_token);
            contentHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('bearer'));
            that.myglobal.initSession();
            let link = ['Dashboard', {}];
            that.router.navigate(link);
        };
        this.httputils.doPost(this.endpoint, body, successCallback, errorLogin);
    }
    recover(event){
        event.preventDefault();
        let link = ['AccountRecover', {}];
        this.router.navigate(link);
    }

}
//-----------------------ACTIVAR------------------------------
@Component({
    selector: 'activate',
    templateUrl: SystemJS.map.app+'/account/activate/index.html',
    styleUrls: [SystemJS.map.app+'/account/style.css']
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
    onLogin(event){
        event.preventDefault();
        let link = ['AccountLogin', {}];
        this.router.navigate(link);
    }
}
//-------------------------Recover-------------------------
@Component({
    selector: 'recover',
    templateUrl: SystemJS.map.app+'/account/recover/index.html',
    styleUrls: [SystemJS.map.app+'/account/style.css']
})
export class AccountRecover extends RestController {

    form:ControlGroup;
    username:Control;

    constructor(public router:Router, public http:Http, public _formBuilder:FormBuilder,public toastr: ToastsManager) {
        super(http,toastr);
        this.setEndpoint(localStorage.getItem('url')+'/users/recover/');
        this.initForm();
    }
    initForm() {
        this.username = new Control("", Validators.compose([Validators.required]));
        this.form = this._formBuilder.group({
            username: this.username,
        });
    }
    recoverPassword(event){
        event.preventDefault();
        let successCallback= response => {
            this.toastr.success('Correo Enviado','Solicitud Procesada.');
            let link = ['AccountLogin', {}];
            this.router.navigate(link);
        }
        this.httputils.doGet(this.endpoint+this.username.value,successCallback,this.error,true);
    }
    onLogin(event){
        event.preventDefault();
        let link = ['AccountLogin', {}];
        this.router.navigate(link);
    }
}
//-------------------------Recover Password-------------------------
@Component({
    selector: 'recoverPassword',
    templateUrl: SystemJS.map.app+'/account/recoverPassword/index.html',
    styleUrls: [SystemJS.map.app+'/account/style.css']
})
export class AccountRecoverPassword extends RestController {

    form:ControlGroup;
    password:Control;

    constructor(public params:RouteParams, public router:Router, public http:Http, public _formBuilder:FormBuilder,public toastr: ToastsManager) {
        super(http,toastr);
        this.setEndpoint('/users/' + params.get('id') + "?access_token=" + params.get('token'));
        this.initForm();
    }
    initForm() {
        this.password = new Control("", Validators.compose([Validators.required,Validators.minLength(4)]));
        this.form = this._formBuilder.group({
            password: this.password,
        });
    }
    recoverPassword(event){
        event.preventDefault();
        let body = JSON.stringify({'password':this.password.value});
        let successCallback= response => {
            this.toastr.success('Contraseña Actualizada','Solicitud Procesada.');
            let link = ['AccountLogin', {}];
            this.router.navigate(link);
        }
        this.httputils.doPut(this.endpoint,body,successCallback,this.error)
    }

    onLogin(event){
        event.preventDefault();
        let link = ['AccountLogin', {}];
        this.router.navigate(link);
    }
}

