import { Component,EventEmitter } from '@angular/core';
import  {FormBuilder, Validators, Control, ControlGroup} from '@angular/common';
import {Http} from "@angular/http";
import {RestController} from "../common/restController";
import {SELECT_DIRECTIVES} from 'ng2-select/ng2-select';


@Component({
    selector: 'empresa-save',
    templateUrl: 'app/empresa/save.html',
    styleUrls: ['app/empresa/style.css'],
    directives: [SELECT_DIRECTIVES],
    inputs:['idModal'],
    outputs:['save'],
})
export class EmpresaSave extends RestController{

    public idModal:string;
    public save:any;
    
    form: ControlGroup;
    name:Control;
    ruc:Control;
    responsiblePerson:Control;
    phone:Control;
    address:Control;
    image:Control;
    companyType:Control;

    public companyTypes:any=[];
    
    
    constructor(public http:Http,public _formBuilder: FormBuilder) {
        super(http);
        this.setEndpoint('/companies/');
        this.loadDataCompanyTypes();
        this.initForm();
        this.save = new EventEmitter();
    }
    
    initForm(){

        this.name = new Control("", Validators.compose([Validators.required]));
        this.ruc = new Control("", Validators.compose([Validators.required]));
        this.responsiblePerson = new Control("", Validators.compose([Validators.required]));
        this.phone = new Control("", Validators.compose([Validators.required]));
        this.address = new Control("", Validators.compose([Validators.required]));
        this.image = new Control("", Validators.compose([Validators.required]));
        this.companyType = new Control("", Validators.compose([Validators.required]));
        
        this.form = this._formBuilder.group({
            name: this.name,
            ruc: this.ruc,
            responsiblePerson: this.responsiblePerson,
            phone: this.phone,
            address: this.address,
            image: this.image,
            companyType: this.companyType,
        });
    }
    loadDataCompanyTypes(){
        let successCallback= response => {
            Object.assign(this.companyTypes, response.json());
            this.companyTypes.list.forEach(obj=>{
                let icon = obj.icon?obj.icon:'fa fa-building-o';
                this.items.push({id:obj.id,text:"<i class='"+icon+"'></i> <strong>"+obj.title+"</strong> "+obj.detail});
            });
        };
        this.httputils.doGet('/search/type/companies/',successCallback,this.error);
    }
    submitForm(){
        let successCallback= response => {
            this.save.emit(response.json());
        };
        let body = JSON.stringify(this.form.value);
        this.httputils.doPost(this.endpoint,body,successCallback,this.error);
    }

    public items:any = [];
    public refreshValue(value:any):void {
        this.companyType.updateValue(value.id);
    }
}

