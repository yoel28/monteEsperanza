import {Component, EventEmitter, OnInit} from '@angular/core';
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
export class TipoEmpresaSave extends RestController implements OnInit{

    public idModal:string;
    public save:any;

    form: ControlGroup;
    title: Control;
    icon: Control;
    detail: Control;
    code: Control;
    free: Control;
    credit: Control;


    constructor(public http:Http,public _formBuilder: FormBuilder,public toastr?: ToastsManager) {
        super(http,toastr);
        this.save = new EventEmitter();
        this.setEndpoint('/type/companies/');
    }
    ngOnInit(){
        this.initTipos();
        this.initAccess();
        this.initCredit();
        this.initForm();
    }
    initForm(){

        this.title = new Control("", Validators.compose([Validators.required,Validators.maxLength(35)]));
        this.icon = new Control("", Validators.compose([Validators.required]));
        this.detail = new Control("", Validators.compose([Validators.required]));
        this.code = new Control("", Validators.compose([Validators.required]));
        this.free = new Control("", Validators.compose([Validators.required]));
        this.credit = new Control("",Validators.compose([Validators.required]));

        this.form = this._formBuilder.group({
            title: this.title,
            icon: this.icon,
            detail: this.detail,
            code: this.code,
            free: this.free,
            credit: this.credit,
        });

    }
    public itemsCredit:any = [];
    initCredit(){
        this.itemsCredit=[
            {'id': 1, 'text':'Grupo a credito'},
            {'id': 2, 'text': 'Grupo a contado'},
        ]
    }
    public refreshValueCredit(value:any):void {
        this.credit.updateValue(value.id==1?true:false);
    }

    public itemsAccess:any = [];
    initAccess(){
        this.itemsAccess=[
            {'id': 1, 'text':'Libre'},
            {'id': 2, 'text': 'Pago'},
        ]
    }
    public refreshValueAccess(value:any):void {
        this.free.updateValue(value.id==1?true:false);
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
