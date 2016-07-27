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
    selector: 'reporte-grupos',
    templateUrl: 'app/reportes/grupos.html',
    pipes: [Fecha],
    styleUrls: ['app/reportes/style.css'],
    directives : [Filter,Datepicker]
})
export class ReporteGrupos extends RestController{

    form: ControlGroup;
    dateStart:Control;
    dateEnd:Control;
    fechaRegistro:any;

    constructor(public router: Router,public http: Http,toastr:ToastsManager,public myglobal:globalService,public _formBuilder: FormBuilder) {
        super(http,toastr);
        this.setEndpoint('/reports/groups');
    }
    ngOnInit(){
        this.initForm();
        this.getCompanyTypes();
    }
    initForm(){
        this.dateStart = new Control("", Validators.compose([Validators.required]));
        this.dateEnd = new Control("");

        this.form = this._formBuilder.group({
            dateStart: this.dateStart,
            dateEnd: this.dateEnd,
        });
    }
    public formatDateFact = {
        format: "dd/mm/yyyy",
        startView: 2,
        minViewMode: 0,
        maxViewMode: 2,
        language: "es",
        forceParse: false,
        autoclose: true,
        todayBtn: "linked",
        todayHighlight: true,
    }
    public params:any={};

    loadFechaFac(data) {
        if (data.key == "1")
            this.dateStart.updateValue(data.date)
        else
            this.dateEnd.updateValue(data.date)
    }

    loadReporte(event){
        event.preventDefault();
        let final=this.dateEnd.value;
        if (!this.dateEnd.value) {
            final = (moment(this.dateStart.value).add(1, 'days'));
        }
        else{
            final = (moment(this.dateEnd.value).add(1, 'days'));
        }

        this.params = {
            'dateStart': moment(this.dateStart.value.toString()).format('DD-MM-YYYY'),
            'dateEnd': moment(final.toString()).format('DD-MM-YYYY'),
        };
        let type=""
        if(this.idCompanyType && this.idCompanyType!="-1")
            type=",['op':'eq','field':'t.id','value':"+this.idCompanyType+"]"
        let noGroup=""
        if(this.idCompanyType && this.idCompanyType!="-2")
            noGroup="&noGroup=true";

        
        let where ="[['op':'ge','field':'dateCreated','value':'"+this.params.dateStart+"','type':'date']," +
            "['op':'lt','field':'dateCreated','value':'"+this.params.dateEnd+"','type':'date']"+type+"]"+noGroup;
        
        this.where = "&where="+encodeURI(where);
        this.max=100;
        this.loadData();
        this.fechaRegistro = new Date();
    }
    sumTotalPeso(id){
        let total=0;
        this.dataList.list[id].recharges.forEach(val=>{
            total+=(val.weightIn-val.weightOut);
        })
        return total;
    }
    sumTotalFact(id){
        let total=0;
        this.dataList.list[id].recharges.forEach(val=>{
            total+=(val.quantity);
        })
        return total;
    }
    onPrint(){
        var printContents = document.getElementById("reporte").innerHTML;
        var popupWin = window.open('', '_blank');
        popupWin.document.open();
        popupWin.document.write('<body onload="window.print()">' + printContents + '</body>');
        popupWin.document.head.innerHTML = (document.head.innerHTML);
        popupWin.document.close();
    }
    public companyTypes:any={};
    public idCompanyType:string="-1";
    getCompanyTypes(){
        this.httputils.onLoadList("/type/companies",this.companyTypes,this.error);
    }
    setType(data){
        this.idCompanyType=data;
    }
}