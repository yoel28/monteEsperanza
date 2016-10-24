import {Component, OnInit} from '@angular/core';
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
import {Search} from "../utils/search/search";
declare var jQuery:any;
declare var SystemJS:any;
declare var Table2Excel:any;

@Component({
    selector: 'reporte-gv',
    templateUrl: SystemJS.map.app+'/reportes/grupoVehiculo.html',
    styleUrls: [SystemJS.map.app+'/reportes/style.css'],
    directives : [Datepicker,Search]
})
export class ReporteGruposVehiculos extends RestController implements OnInit{
    form: ControlGroup;
    dateStart:Control;
    dateEnd:Control;
    plate:Control;
    public title:string;

    constructor(public router: Router,public http: Http,toastr:ToastsManager,public myglobal:globalService,public _formBuilder: FormBuilder) {
        super(http,toastr);
        this.setEndpoint('/reports/vehicle/groups');
    }
    ngOnInit(){
        this.title="Reporte por vehículos y grupos";
        this.initForm();
        this.getCompanyTypes();
    }

    initForm(){
        this.dateStart = new Control("", Validators.compose([Validators.required]));
        this.dateEnd = new Control("");
        this.plate = new Control("");

        this.form = this._formBuilder.group({
            dateStart: this.dateStart,
            dateEnd: this.dateEnd,
            plate: this.plate,
        });
    }
    public formatDateFact = {
        format: "dd/mm/yyyy",
        startDate:'01/01/2016',
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

    loadReporte(event?){
        if(event)
            event.preventDefault();
        if(!this.dateStart.value)
            this.dateStart.updateValue(moment().format('lll'))

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

        let type="";
        if(this.idCompanyType && this.idCompanyType!="-1")
            type=",['op':'eq','field':'companyTypeName','value':'"+this.idCompanyType+"']";

        let plate="";
        if(this.plate.value && this.plate.value.length > 0)
            plate=",['op':'eq','field':'v.plate','value':'"+this.plate.value+"']";


        let where ="[['op':'ge','field':'dateCreated','value':'"+this.params.dateStart+"','type':'date']," +
            "['op':'lt','field':'dateCreated','value':'"+this.params.dateEnd+"','type':'date']"+type+plate+"]";

        this.where = "&where="+encodeURI(where);
        this.max=1000;
        this.loadData();
    }
    onPrint(){
        var printContents = document.getElementById("reporte").innerHTML;
        var popupWin = window.open('', '_blank');
        popupWin.document.open();
        popupWin.document.write('<body onload="window.print()">' + printContents + '</body>');
        popupWin.document.head.innerHTML = (document.head.innerHTML);
        popupWin.document.close();
    }

    //lapso de fechas
    public itemsFecha=[
        {'id':'1','text':'Hoy'},
        {'id':'2','text':'Semana actual'},
        {'id':'3','text':'Mes actual'},
        {'id':'4','text':'Mes anterior'},
        {'id':'5','text':'Últimos 3 meses'},
        {'id':'6','text':'Año actual'},
    ]
    setFecha(id){
        //Thu Jul 09 2015 00:00:00 GMT-0400 (VET)
        let day = moment().format('lll');
        let val;
        switch (id)
        {
            case "1" : //hoy
                this.dateStart.updateValue(day);
                break;
            case "2" ://Semana Actual
                this.dateStart.updateValue(moment(day).startOf('week'));
                this.dateEnd.updateValue(day);
                break;
            case "3" ://mes actual
                this.dateStart.updateValue(moment().startOf('month'));
                this.dateEnd.updateValue(day);
                break;
            case "4" ://mes anterior
                this.dateStart.updateValue(moment().subtract(1, 'month').startOf('month'));
                this.dateEnd.updateValue(moment().subtract(1, 'month').endOf('month'));
                break;
            case "5" ://ultimos 3 meses
                this.dateStart.updateValue(moment().subtract(3, 'month').startOf('month'));
                this.dateEnd.updateValue(day);
                break;
            case "6" ://ano actual
                this.dateStart.updateValue(moment().startOf('year'));
                this.dateEnd.updateValue(day);
                break;
        }
        if(id!='-1')
            this.loadReporte();

    }

    exportCSV(){
        let table2excel = new Table2Excel({
            'defaultFileName': this.title,
        });
        Table2Excel.extend((cell, cellText) => {
            if (cell) return {
                v:cellText,
                t: 's',
            };
            return null;
        });
        table2excel.export(document.querySelectorAll("table.export"));
    }

    public companyTypes:any={};
    public idCompanyType:string="-1";
    getCompanyTypes(){
        this.httputils.onLoadList("/type/companies",this.companyTypes,this.error);
    }
    setType(data){
        this.idCompanyType=data;
        this.loadReporte();
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
        return [min,max,avg,total];
    }
    public searchTipoEmpresa = {
        title: "Grupo",
        idModal: "searchTipoEmpresa",
        endpoint: "/search/type/companies/",
        placeholder: "Ingrese el grupo",
        label: {name: "Nombre: ", detail: "Detalle: "},
    }
    assignTipoEmpresa(data){
        this.msgLabelAll=false;
        this.setType(data.title);
    }
    public msgLabelAll:boolean=true;
    cambiarAll(){
        if(!this.msgLabelAll){
            this.setType('-1');
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


