import { Component,EventEmitter } from '@angular/core';
import  {FormBuilder, Validators, Control, ControlGroup} from '@angular/common';
import {RestController} from "../common/restController";
import {Http} from "@angular/http";

@Component({
    selector: 'tag-save',
    templateUrl: 'app/tagRfid/save.html',
    styleUrls: ['app/tagRfid/style.css'],
    inputs:['idModal'],
    outputs:['save'],
})
export class TagSave extends RestController{

    public idModal:string;
    public save:any;

    form: ControlGroup;
    number: Control;


    constructor(public http:Http,public _formBuilder: FormBuilder) {
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
        let successCallback= response => {
            this.save.emit(response.json());
        };
        let body = JSON.stringify(this.form.value);
        this.httputils.doPost(this.endpoint,body,successCallback,this.error);
    }
}
