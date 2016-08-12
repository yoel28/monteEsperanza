import {Component, OnInit} from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import {RestController} from "../common/restController";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {globalService} from "../common/globalService";
import {Filter} from "../utils/filter/filter";
import {FormBuilder} from "@angular/common";
import {Datepicker} from "../common/xeditable";
import {Fecha} from "../utils/pipe";
import {Search} from "../utils/search/search";

declare var jQuery:any;

@Component({
    selector: 'reporte-db',
    templateUrl: 'app/reportes/descargasBasura.html',
    pipes: [Fecha],
    styleUrls: ['app/reportes/style.css'],
    directives : [Filter,Datepicker,Search]
})
export class ReporteDescargasBasura extends RestController implements OnInit{

    constructor(public router: Router,public http: Http,toastr:ToastsManager,public myglobal:globalService,public _formBuilder: FormBuilder) {
        super(http,toastr);
        this.setEndpoint('/report/weight/trash');
    }
    ngOnInit(){
    }
    public trashName:string="all";
    setType(data){
        this.trashName=data;
        if(this.trashName!="-1")
            this.loadMatriz();
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
    public dataConsult:any={'date':'2016'};

    loadMatriz(data?) {
        if(data){
            this.dataConsult=data
        }

        let that = this;
        let type="";
        if(this.trashName!="all")
            type="?type="+this.trashName;

        let successCallback = response => {
            Object.assign(that.dataList,response.json())
        };
        this.httputils.doGet('/reports/weight/trash/'+this.dataConsult.date+type,successCallback,this.error);
    }
    exportCSV(){
        jQuery("#content").tableToCSV();
    }

    minMaxAvgSum(data){
        let min=9999999999999999999;
        let max=-999999999999999999;
        let total=0.0;
        let avg=0.0;
        data.forEach(val=>{
            if(val<min)
                min=val;
            if(val>max)
                max=val;
            total+=val;
        })
        avg=total/data.length;
        this.minMaxAvgSumGlobal([min,max,total]);
        return [min,max,avg.toFixed(3),total];
    }

    public searchBasura = {
        title: "Tipo de basura",
        idModal: "searchModalBasura",
        endpointForm: "/search/type/trash/",
        placeholderForm: "Ingrese el tipo de basura",
        labelForm: {name: "Tipo: ", detail: "Referencia: "},
    }
    assignBasura(data){
        this.msgLabelAll=false;
        this.setType(data.title);
    }
    public msgLabelAll:boolean=true;
    cambiarAll(){
        if(!this.msgLabelAll){
            this.setType('all');
        }
        this.msgLabelAll=true;
    }
    public minG=9999999999999999999;
    public maxG=-999999999999999999;
    public totalG=0;
    public count=0;
    public avgG="0";
    minMaxAvgSumGlobal(data?){
        if(data){
            if(data[0]<this.minG)
                this.minG=data[0];
            if(data[1]>this.maxG)
                this.maxG=data[1]
            this.totalG+=data[2];
            this.count++;
            this.avgG=(this.totalG/this.count).toFixed(3);
        }
        else{
            this.minG=9999999999999999999;
            this.maxG=-999999999999999999;
            this.totalG=0.0;
            this.avgG="0";
            this.count=0;
        }
    }

}

