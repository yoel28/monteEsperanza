import { Component,EventEmitter } from '@angular/core';
import  {FormBuilder, Validators, Control, ControlGroup} from '@angular/common';
import {Http} from "@angular/http";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {RestController} from "../common/restController";
import {Xfile, Xcropit} from "../common/xeditable";
import {globalService} from "../common/globalService";

@Component({
    selector: 'user-save',
    templateUrl: 'app/user/save.html',
    styleUrls: ['app/user/style.css'],
    inputs:['idModal'],
    outputs:['save'],
    directives:[Xfile,Xcropit]
})
export class UserSave extends RestController{

    public idModal:string;
    public save:any;

    form: ControlGroup;
    username: Control;
    name: Control;
    email: Control;
    password: Control;
    phone: Control;
    image: Control;

    constructor(public http:Http,public _formBuilder: FormBuilder,public toastr: ToastsManager,public myglobal:globalService) {
        super(http,toastr);
        this.save = new EventEmitter();
    }
    ngOnInit(){
        if(this.myglobal.existsPermission('58')){
            this.setEndpoint('/users/');
            this.initForm();
        }
    }
    initForm(){

        this.username = new Control("", Validators.compose([Validators.required,Validators.maxLength(10)]));
        this.name = new Control("", Validators.compose([Validators.required]));
        this.email = new Control("", Validators.compose([Validators.required]));
        this.password = new Control("", Validators.compose([Validators.required]));
        this.phone = new Control("", Validators.compose([Validators.required]));
        this.image = new Control("");

        this.form = this._formBuilder.group({
            username: this.username,
            name: this.name,
            email: this.email,
            password: this.password,
            phone: this.phone,
            image: this.image,
        });

    }
    submitForm(){
        let successCallback= response => {
            this.save.emit(response.json());
            this.toastr.success('Guardado con éxito','Notificación')
        };
        let body = JSON.stringify(this.form.value);
        this.httputils.doPost(this.endpoint,body,successCallback,this.error);
    }
    //formulario de imagen
    changeImage(data){
        this.image.updateValue(data);
    }
}
