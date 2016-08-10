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


@Component({
    selector: 'reporte-grupos',
    templateUrl: 'app/reportes/grupos.html',
    pipes: [Fecha],
    styleUrls: ['app/reportes/style.css'],
    directives : [Filter,Datepicker,Search]
})
export class ReporteGrupos extends RestController implements OnInit{

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
    public searchTipoEmpresa = {
        title: "Grupo",
        idModal: "searchTipoEmpresa",
        endpointForm: "/search/type/companies/",
        placeholderForm: "Ingrese el grupo",
        labelForm: {name: "Nombre: ", detail: "Detalle: "},
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
        let type=""
        if(this.idCompanyType && this.idCompanyType!="-1" && this.idCompanyType!="-2")
            type=",['op':'eq','field':'t.id','value':"+this.idCompanyType+"]"
        let noGroup=""
        if(this.idCompanyType && this.idCompanyType=="-2")
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
    public companyTypeName:string="-1";
    getCompanyTypes(){
        this.httputils.onLoadList("/type/companies",this.companyTypes,this.error);
    }
    setType(data){
        this.idCompanyType=data;
        this.loadReporte();
    }
    assignTipoEmpresa(data){
        this.setType(data.id);
        this.companyTypeName=data.title;
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
    formatDate(date,format){
        if(date)
            return moment(date).format(format);
        return "";
    }
    public msgLabelAll:boolean=true;
    cambiarAll(){
        if(this.msgLabelAll){
            this.setType('-2');
        }
        else
            this.setType('-1');
        
        this.companyTypeName="-1";
        this.msgLabelAll=!this.msgLabelAll;
    }
}