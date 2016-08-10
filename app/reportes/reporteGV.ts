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

declare var jQuery:any;

@Component({
    selector: 'reporte-gv',
    templateUrl: 'app/reportes/grupoVehiculo.html',
    styleUrls: ['app/reportes/style.css'],
    directives : [Datepicker]
})
export class ReporteGruposVehiculos extends RestController implements OnInit{
    form: ControlGroup;
    dateStart:Control;
    dateEnd:Control;
    plate:Control;

    constructor(public router: Router,public http: Http,toastr:ToastsManager,public myglobal:globalService,public _formBuilder: FormBuilder) {
        super(http,toastr);
        this.setEndpoint('/reports/vehicle/groups');
    }
    ngOnInit(){
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
            case "1" :
                this.dateStart.updateValue(day);
                break;
            case "2" :
                val=moment().format('e');
                this.dateStart.updateValue(moment(day).subtract(val, 'days'));
                this.dateEnd.updateValue(day);
                break;
            case "3" :
                val=moment().format('D');
                this.dateStart.updateValue((moment(day).subtract(val, 'days')).add(1,'days'));
                this.dateEnd.updateValue(day);
                break;
            case "4" :
                val=moment().format('D');
                this.dateStart.updateValue(((moment(day).subtract(val, 'days')).subtract(1, 'month')).add(1,'days'));
                this.dateEnd.updateValue(moment(day).subtract(val, 'days'));
                break;
            case "5" :
                this.dateStart.updateValue((moment(day).subtract(3, 'month')).add(1,'days'));
                this.dateEnd.updateValue(day);
                break;
            case "6" :
                val=moment().format('MM');
                this.dateStart.updateValue((moment(day).subtract(val, 'month')).add(1,'days'));
                this.dateEnd.updateValue(day);
                break;
        }
        if(id!='-1')
            this.loadReporte();

    }

    exportCSV(){
        jQuery("#content").tableToCSV();
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
        return [min,max,avg.toFixed(3),total];
    }




}


