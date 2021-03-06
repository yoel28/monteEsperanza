import {Component, EventEmitter, NgZone, OnInit} from '@angular/core';
import  {FormBuilder, Validators, Control, ControlGroup} from '@angular/common';
import {Http} from "@angular/http";
import {RestController} from "../common/restController";
import {SELECT_DIRECTIVES} from 'ng2-select/ng2-select';
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {Xfile, Xcropit} from "../common/xeditable";
import {globalService} from "../common/globalService";
declare var SystemJS:any;

@Component({
    selector: 'empresa-save',
    templateUrl: SystemJS.map.app+'/empresa/save.html',
    styleUrls: [SystemJS.map.app+'/empresa/style.css'],
    directives: [SELECT_DIRECTIVES,Xfile,Xcropit],
    inputs:['idModal'],
    outputs:['save'],
})
export class EmpresaSave extends RestController implements OnInit{

    public idModal:string;
    public save:any;
    
    form: ControlGroup;
    name:Control;
    ruc:Control;
    responsiblePerson:Control;
    code:Control;
    phone:Control;
    address:Control;
    image:Control;
    companyType:Control;

    public companyTypes:any=[];
    
    
    constructor(public http:Http,public _formBuilder: FormBuilder,public toastr: ToastsManager,public myglobal:globalService) {
        super(http,toastr);
        this.save = new EventEmitter();
    }
    ngOnInit(){
        if(this.myglobal.existsPermission('68')){
            this.setEndpoint('/companies/');
            this.initForm();
        }
        if(this.myglobal.existsPermission('36')) {
            this.loadDataCompanyTypes();
        }
    }
    
    initForm(){

        this.name = new Control("", Validators.compose([Validators.required,Validators.maxLength(35)]));
        this.ruc = new Control("", Validators.compose([Validators.required]));
        this.responsiblePerson = new Control("", Validators.compose([Validators.required]));
        this.phone = new Control("", Validators.compose([Validators.required]));
        this.address = new Control("", Validators.compose([Validators.required]));
        this.image = new Control("");
        this.companyType = new Control("", Validators.compose([Validators.required]));
        this.code = new Control("", Validators.compose([Validators.required]));

        this.form = this._formBuilder.group({
            name: this.name,
            ruc: this.ruc,
            responsiblePerson: this.responsiblePerson,
            phone: this.phone,
            address: this.address,
            image: this.image,
            companyType: this.companyType,
            code: this.code,
        });
    }
    submitForm(){
        let that=this;
        let successCallback= response => {
            that.save.emit(response.json());
            that.resetForm();
            that.toastr.success('Guardado con éxito','Notificación')
        };
        let body = JSON.stringify(this.form.value);
        this.httputils.doPost(this.endpoint,body,successCallback,this.error);
    }

    //---------------------tipo de companias------------------------------------------------

    public items:any = [];
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
    public refreshValue(value:any):void {
        this.companyType.updateValue(value.id);
    }
    //formulario de imagen
    changeImage(data){
        this.image.updateValue(data);
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

