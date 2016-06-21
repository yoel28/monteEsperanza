import { Component,EventEmitter } from '@angular/core';
import  {FormBuilder, Validators, Control, ControlGroup} from '@angular/common';
import {RestController} from "../common/restController";
import {Http} from "@angular/http";
import {SELECT_DIRECTIVES} from 'ng2-select/ng2-select';

@Component({
    selector: 'tipoRecarga-save',
    templateUrl: 'app/tipoRecarga/save.html',
    styleUrls: ['app/tipoRecarga/style.css'],
    directives:[SELECT_DIRECTIVES],
    inputs:['idModal'],
    outputs:['save'],
})
export class TipoRecargaSave extends RestController{

    public idModal:string;
    public save:any;

    form: ControlGroup;
    title: Control;
    detail: Control;
    icon: Control;

    constructor(public http:Http,public _formBuilder: FormBuilder) {
        super(http);
        this.setEndpoint('/type/recharges/');
        this.initForm();
        this.initSelect();
        this.save = new EventEmitter();
    }
    initForm(){
        this.title = new Control("", Validators.compose([Validators.required, Validators.maxLength(15)]));
        this.detail = new Control("", Validators.compose([Validators.required , Validators.maxLength(100)]));
        this.icon = new Control("", Validators.compose([Validators.required]));

        this.form = this._formBuilder.group({
            title: this.title,
            icon: this.icon,
            detail: this.detail,
        });
    }
    private icons:any = [
        'fa fa-cc-amex','fa fa-cc-mastercard','fa fa-credit-card',
        'fa fa-cc-diners-club','fa fa-cc-paypal','fa fa-google-wallet',
        'fa fa-cc-discover','fa fa-cc-stripe','fa fa-paypal',
        'fa fa-cc-jcb', 'fa fa-cc-visa','fa fa-money'
    ];
    initSelect(){
        this.icons.forEach(obj=>{
            this.items.push({"id":obj,"text":"<i class='"+obj+"'></i>&nbsp;"+obj});
        });
    }
    public items:any=[];

    public refreshValue(value:any):void {
        this.icon.updateValue(value.id);
    }
    submitForm(){
        let successCallback= response => {
            this.save.emit(response.json());
        };
        let body = JSON.stringify(this.form.value);
        this.httputils.doPost(this.endpoint,body,successCallback,this.error);
    }
}

