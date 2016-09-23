import {Component, EventEmitter, OnInit} from '@angular/core';
import  {FormBuilder, Validators, Control, ControlGroup} from '@angular/common';
import {Http} from "@angular/http";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {RestController} from "../common/restController";
import {Xfile, Xcropit} from "../common/xeditable";
import {globalService} from "../common/globalService";
declare var SystemJS:any;
@Component({
    selector: 'user-save',
    templateUrl: SystemJS.map.app+'/user/save.html',
    styleUrls: [SystemJS.map.app+'/user/style.css'],
    inputs:['idModal'],
    outputs:['save'],
    directives:[Xfile,Xcropit]
})
export class UserSave extends RestController implements OnInit{

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

        this.username = new Control("", Validators.compose([Validators.required,Validators.maxLength(35)]));
        this.name = new Control("", Validators.compose([Validators.required]));
        this.email = new Control("", Validators.compose([Validators.required,this.validateEmail]));
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
    validateEmail(c: Control) {
        let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
        return EMAIL_REGEXP.test(c.value) ? null : {
            validateEmail: {
                valid: false
            }
        };
    }
    submitForm(){
        let that = this;
        let successCallback= response => {
            that.resetForm();
            that.save.emit(response.json());
            that.toastr.success('Guardado con éxito','Notificación')
        };
        let body = JSON.stringify(this.form.value);
        this.httputils.doPost(this.endpoint,body,successCallback,this.error);
    }
    resetForm(){
        let that=this;
        Object.keys(this).forEach(key=>{
            if(that[key] instanceof Control){
                that[key].updateValue(null);
                that[key].setErrors(null);
                that[key]._pristine=true;
            }
        })
    }
    //formulario de imagen
    changeImage(data){
        this.image.updateValue(data);
    }
}
