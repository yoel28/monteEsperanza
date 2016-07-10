import { Component,EventEmitter } from '@angular/core';
import  {FormBuilder, Validators, Control, ControlGroup} from '@angular/common';
import {RestController} from "../common/restController";
import {Http} from "@angular/http";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {SELECT_DIRECTIVES} from "ng2-select/ng2-select";

@Component({
    selector: 'tipoEmpresa-save',
    templateUrl: 'app/tipoEmpresa/save.html',
    styleUrls: ['app/tipoEmpresa/style.css'],
    directives: [SELECT_DIRECTIVES],
    inputs:['idModal'],
    outputs:['save'],
})
export class TipoEmpresaSave extends RestController{

    public idModal:string;
    public save:any;

    form: ControlGroup;
    title: Control;
    icon: Control;
    detail: Control;


    constructor(public http:Http,public _formBuilder: FormBuilder,public toastr?: ToastsManager) {
        super(http,toastr);
        this.save = new EventEmitter();
        this.setEndpoint('/type/companies/');
    }
    ngOnInit(){
        this.initTipos();
        this.initForm();
    }
    initForm(){

        this.title = new Control("", Validators.compose([Validators.required]));
        this.icon = new Control("", Validators.compose([Validators.required]));
        this.detail = new Control("", Validators.compose([Validators.required]));

        this.form = this._formBuilder.group({
            title: this.title,
            icon: this.icon,
            detail: this.detail,
        });

    }
    submitForm(){
        let successCallback= response => {
            this.save.emit(response.json());
        };
        let body = JSON.stringify(this.form.value);
        this.httputils.doPost(this.endpoint,body,successCallback,this.error);
    }

    public items:any = [];
    initTipos(){
        this.items=[
            {'id': 'fa fa-building', 'text':'<i class="fa fa-building"></i> building'},
            {'id': 'fa fa-building-o', 'text': '<i class="fa fa-building-o"></i> building-o'},
            {'id': 'fa fa-home', 'text': '<i class="fa fa-home"></i> home'},
        ]
    }
    public refreshValue(value:any):void {
        this.icon.updateValue(value.id);
    }
}
