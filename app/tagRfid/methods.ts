import { Component,EventEmitter } from '@angular/core';
import  {FormBuilder, Validators, Control, ControlGroup} from '@angular/common';
import {RestController} from "../common/restController";
import {Http} from "@angular/http";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
declare var SystemJS:any;

@Component({
    selector: 'tag-save',
    templateUrl: SystemJS.map.app+'/tagRfid/save.html',
    styleUrls: [SystemJS.map.app+'/tagRfid/style.css'],
    inputs:['idModal'],
    outputs:['save'],
})
export class TagSave extends RestController{

    public idModal:string;
    public save:any;

    form: ControlGroup;
    number: Control;


    constructor(public http:Http,public _formBuilder: FormBuilder,public toastr: ToastsManager) {
        super(http);
        this.setEndpoint('/rfids/');
        this.initForm();
        this.save = new EventEmitter();
    }
    initForm(){
        this.number = new Control("", Validators.compose([Validators.required]));

        this.form = this._formBuilder.group({
            number: this.number,
        });
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
}
