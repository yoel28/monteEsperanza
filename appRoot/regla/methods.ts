import {Component, EventEmitter, OnInit} from '@angular/core';
import  {FormBuilder, Validators, Control, ControlGroup} from '@angular/common';
import {RestController} from "../common/restController";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {Http} from "@angular/http";
declare var SystemJS:any;

@Component({
    selector: 'regla-save',
    templateUrl: SystemJS.map.app+'/regla/save.html',
    styleUrls: [SystemJS.map.app+'/regla/style.css'],
    inputs:['idModal'],
    outputs:['save'],
})
export class ReglaSave extends RestController implements OnInit{

    public idModal:string;
    public save:any;

    form: ControlGroup;
    rule: Control;
    name: Control;
    detail: Control;


    constructor(public _formBuilder: FormBuilder,public http:Http,public toastr: ToastsManager) {
        super(http,toastr);
        this.setEndpoint('/rules/');
        this.save = new EventEmitter();
    }
    ngOnInit(){
        this.initForm();
    }
    initForm(){
        this.rule = new Control("", Validators.compose([Validators.required]));
        this.name = new Control("", Validators.compose([Validators.required]));
        this.detail = new Control("");

        this.form = this._formBuilder.group({
            rule: this.rule,
            name: this.name,
            detail: this.detail,
        });
    }
    submitForm(){
        let that=this;
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
}
