import { Component } from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import {RestController} from "../common/restController";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {globalService} from "../common/globalService";
import {Filter} from "../utils/filter/filter";
import {FormBuilder, ControlGroup, Control, Validators} from "@angular/common";
import moment from 'moment/moment';
import {Datepicker} from "../common/xeditable";
import {Fecha} from "../utils/pipe";


@Component({
    selector: 'reporte-dg',
    templateUrl: 'app/reportes/descargasGrupos.html',
    pipes: [Fecha],
    styleUrls: ['app/reportes/style.css'],
    directives : [Filter,Datepicker]
})
export class ReporteDescargasGrupos extends RestController{

    constructor(public router: Router,public http: Http,toastr:ToastsManager,public myglobal:globalService,public _formBuilder: FormBuilder) {
        super(http,toastr);
        this.setEndpoint('consultas/2016.json');
    }
    ngOnInit(){
        this.getCompanyTypes();
    }

    public companyTypes:any={};
    public idCompanyType:string="-1";
    getCompanyTypes(){
        this.httputils.onLoadList("/type/companies",this.companyTypes,this.error);
    }
    setType(data){
        this.idCompanyType=data;
    }
    public msgLabel:boolean=true;
    cambiar(){
        this.msgLabel=!this.msgLabel;
    }
    public formatDate1 = {
        format: "mm/yyyy",
        startView: 2,
        minViewMode: 1,
        maxViewMode: 2,
        todayBtn: "linked",
        language: "es",
        forceParse: false,
        autoclose: true,
        todayHighlight: true,
        return: 'YYYY/MM',
    }
    public formatDate2 = {
        format: "yyyy",
        startView: 2,
        minViewMode: 2,
        maxViewMode: 2,
        todayBtn: "linked",
        language: "es",
        forceParse: false,
        autoclose: true,
        todayHighlight: true,
        return: 'YYYY',
    }

    loadMatriz(data) {
        let that = this;

        this.where="";
        if(this.idCompanyType && this.idCompanyType!="-1")
            this.where="&where="+encodeURI("[['op':'eq','field':'t.id','value':"+this.idCompanyType+"]]");

        let successCallback = response => {
            Object.assign(that.dataList,response.json())
        };
        //this.httputils.doGet(this.endpoint+data.data,successCallback, this.error,true)
        //this.loadData();
        this.httputils.onLoadList(this.endpoint,this.dataList,this.max,this.error,true);
    }

}

