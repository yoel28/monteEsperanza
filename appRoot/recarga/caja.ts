import {Component,  OnInit} from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import {RestController} from "../common/restController";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import moment from 'moment/moment';
import {globalService} from "../common/globalService";
//import {Datepicker} from "../common/xeditable";
import {Tooltip} from "../utils/tooltips/tooltips";
import {SMDropdown, DateRangepPicker} from "../common/xeditable";
import {FormBuilder, ControlGroup, Control, Validators} from "@angular/common";
import {CatalogApp} from "../common/catalogApp";

declare var jQuery:any;
declare var SystemJS:any;
declare var Table2Excel:any;

@Component({
    selector: 'caja',
    templateUrl: SystemJS.map.app+'/recarga/caja.html',
    styleUrls: [SystemJS.map.app+'/recarga/style.css'],
    directives:[DateRangepPicker,SMDropdown,Tooltip]
})
export class Caja extends RestController implements OnInit{

    public MONEY_METRIC_SHORT=this.myglobal.getParams('MONEY_METRIC_SHORT');
    public MONEY_METRIC=this.myglobal.getParams('MONEY_METRIC');
    public WEIGTH_METRIC_SHORT=this.myglobal.getParams('WEIGTH_METRIC_SHORT');
    public paramsDate=CatalogApp.formatDateDDMMYYYY;


    public rechargeTotal={};
    public rechargeSum:any=[];
    public typeRecharge:any={};
    public dia:any;

    form: ControlGroup;
    dateStart:Control;
    dateEnd:Control;

    constructor(public router: Router,public http: Http,public _formBuilder: FormBuilder,public toastr: ToastsManager,public myglobal:globalService) {
        super(http,toastr);
        this.setEndpoint('/search/recharges/');
    }
    ngOnInit(){
        if(this.myglobal.existsPermission('109')){
            this.dia = moment();
            this.initForm();
        }
    }
    initForm(){
        this.dateStart = new Control("", Validators.compose([Validators.required]));
        this.dateEnd = new Control("");
        this.form = this._formBuilder.group({
            'dateStart': this.dateStart,
            'dateEnd': this.dateEnd,
        });
    }

    assignDate(data){
        this.dateStart.updateValue(data.start || null);
        this.dateEnd.updateValue(data.end || null);
        this.loadCaja();
    }

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
                this.dateStart.updateValue(moment().format('DD-MM-YYYY'));
                this.dateEnd.updateValue(moment().add(1,'day').format('DD-MM-YYYY'));
                break;
            case "2" ://Semana Actual
                this.dateStart.updateValue(moment().startOf('week').format('DD-MM-YYYY'));
                this.dateEnd.updateValue(moment().endOf('week').format('DD-MM-YYYY'));
                break;
            case "3" ://mes actual
                this.dateStart.updateValue(moment().startOf('month').format('DD-MM-YYYY'));
                this.dateEnd.updateValue(moment().endOf('month').format('DD-MM-YYYY'));
                break;
            case "4" ://mes anterior
                this.dateStart.updateValue(moment().subtract(1, 'month').startOf('month').format('DD-MM-YYYY'));
                this.dateEnd.updateValue(moment().subtract(1, 'month').endOf('month').format('DD-MM-YYYY'));
                break;
            case "5" ://ultimos 3 meses
                this.dateStart.updateValue(moment().subtract(3, 'month').startOf('month').format('DD-MM-YYYY'));
                this.dateEnd.updateValue(moment().endOf('month').format('DD-MM-YYYY'));
                break;
            case "6" ://ano actual
                this.dateStart.updateValue(moment().startOf('year').format('DD-MM-YYYY'));
                this.dateEnd.updateValue(moment().endOf('year').format('DD-MM-YYYY'));
                break;
        }
        if(id!='-1')
            this.loadCaja();
    }
    loadCaja(){
        this.max=20;
        this.where="&where="+encodeURI("[['op':'ge','field':'dateCreated','value':'"+this.dateStart.value+"','type':'date'],['op':'lt','field':'dateCreated','value':'"+this.dateEnd.value+"','type':'date']]");
        this.loadData();
        this.onloadData('/total/recharges/',this.rechargeTotal)
        let where="&where="+encodeURI("[['op':'ge','field':'re.dateCreated','value':'"+this.dateStart.value+"','type':'date'],['op':'lt','field':'re.dateCreated','value':'"+this.dateEnd.value+"','type':'date']]");
        this.onloadData('/operations/sum',this.rechargeSum,null,null,where);
    }
    
    
    getRechargeSum(val){
        let index = this.rechargeSum.findIndex(obj => (obj.companyTypeCredit == val ));
        if(index > -1)
           return this.rechargeSum[index].quantity
        return 0;

    }
    export(type){
        let that=this;
        this.getLoadDataAll([],null,null,0,1000,null,()=>{
                setTimeout(function(_jQuery=jQuery){
                    if(type=='xls')
                        that.exportXls();
                    else if (type == 'print')
                        that.onPrint();
                }, 3000)
            }
        )
    }
    exportXls(){
        let table2excel = new Table2Excel({
            'defaultFileName': 'Caja',
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
    goTaquilla(event, companyId:string) {
        event.preventDefault();
        let link = ['TaquillaSearh', {search: companyId}];
        this.router.navigate(link);
    }
    public typeRechargeIndex:any={};
    formatDate(date,format){
        if(date)
            return moment(date).format(format);
        return "";
    }
    onPrint(){
        var printContents = document.getElementById("reporte").innerHTML;
        var popupWin = window.open('', '_blank');
        popupWin.document.open();
        popupWin.document.write('<body onload="window.print()">' + printContents + '</body>');
        popupWin.document.head.innerHTML = (document.head.innerHTML);
        popupWin.document.close();
    }


}
