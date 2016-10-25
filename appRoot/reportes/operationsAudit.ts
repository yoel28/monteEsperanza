import {Component,  OnInit} from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import {RestController} from "../common/restController";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import moment from 'moment/moment';
import {globalService} from "../common/globalService";
import {SMDropdown, DateRangepPicker} from "../common/xeditable";
import {FormBuilder, ControlGroup, Control, Validators} from "@angular/common";
import {CatalogApp} from "./../common/catalogApp"

declare var jQuery:any;
declare var SystemJS:any;
declare var Table2Excel:any;

@Component({
    selector: 'operations-audit',
    templateUrl: SystemJS.map.app+'/reportes/operationsAudit.html',
    styleUrls: [SystemJS.map.app+'/reportes/style.css'],
    directives:[DateRangepPicker,SMDropdown]
})
export class OperationsAudit extends RestController implements OnInit{

    public MONEY_METRIC_SHORT=this.myglobal.getParams('MONEY_METRIC_SHORT');
    public MONEY_METRIC=this.myglobal.getParams('MONEY_METRIC');
    public WEIGTH_METRIC_SHORT=this.myglobal.getParams('WEIGTH_METRIC_SHORT');

    public paramsDate={'format':"DD-MM-YYYY","minDate":"01-01-2016"};

    public title:string;

    form: ControlGroup;
    dateStart:Control;
    dateEnd:Control;


    public itemsDate:any =  CatalogApp.itemsDate;



    constructor(public router: Router,public http: Http,public _formBuilder: FormBuilder,public toastr: ToastsManager,public myglobal:globalService) {
        super(http,toastr);
        this.setEndpoint('/reports/operations/audit');
    }
    ngOnInit(){
        this.title ="Auditoria de operaciones"
        this.initForm();
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
        this.loadAudit();
    }
    
    setFecha(id){
        if(id!='-1'){
            let range = CatalogApp.getDateRange(id);
            this.dateStart.updateValue(range.start || null);
            this.dateEnd.updateValue(range.end || null);
            this.loadAudit();
        }
    }

    loadAudit(){
        this.max=100;
        this.where="&where="+encodeURI("[['op':'ge','field':'dateCreated','value':'"+this.dateStart.value+"','type':'date'],['op':'lt','field':'dateCreated','value':'"+this.dateEnd.value+"','type':'date']]");
        this.loadData();
    }

    exportCSV(){
        CatalogApp.exportExcel('OperationsAudit');
    }

    formatDate(date,format){
        if(date)
            return moment(date).format(format);
        return "";
    }


}
