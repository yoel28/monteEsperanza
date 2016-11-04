import {Component} from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {globalService} from "../common/globalService";
import {SMDropdown, DateRangepPicker} from "../common/xeditable";
import {FormBuilder, ControlGroup, Control, Validators} from "@angular/common";
import {CatalogApp} from "./../common/catalogApp"
import {ControllerBase} from "../common/ControllerBase";
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";
import {MOperationAudit} from "./MOperationAudit";

declare var jQuery:any;
declare var SystemJS:any;
declare var Table2Excel:any;
declare var moment:any;

@Component({
    selector: 'operations-audit',
    templateUrl: SystemJS.map.app+'/reportes/operationsAudit.html',
    styleUrls: [SystemJS.map.app+'/reportes/style.css'],
    directives:[DateRangepPicker,SMDropdown],
    providers: [TranslateService],
    pipes: [TranslatePipe]
})
export class OperationsAudit extends ControllerBase{

    public form: ControlGroup;
    public dateStart:Control;
    public dateEnd:Control;

    public url:any;

    public paramsDate:any = CatalogApp.formatDateDDMMYYYY;
    public itemsDate:any =  CatalogApp.itemsDate;

    constructor(public router: Router,public http: Http,public _formBuilder: FormBuilder,public toastr: ToastsManager,public myglobal:globalService,public translate:TranslateService) {
        super('RE_AUDIT','/reports/operations/audit',router,http,toastr,myglobal,translate);
    }
    ngOnInit(){
        this.initModel();
        this.initViewOptions();
        this.initForm();
    }
    initModel() {
        this.model= new MOperationAudit(this.myglobal);
    }
    initViewOptions() {
        this.viewOptions.title = "Auditoria de operaciones";
    }

    initForm()
    {
        this.dateStart = new Control("", Validators.compose([Validators.required]));
        this.dateEnd = new Control("");
        this.form = this._formBuilder.group({
            'dateStart': this.dateStart,
            'dateEnd': this.dateEnd,
        });
    }

    //region Carga de fechas desde la vista
    assignDate(data){
        this.dateStart.updateValue(data.start || null);
        this.dateEnd.updateValue(data.end || null);
    }
    
    setFecha(id){
        if(id!='-1'){
            let range = CatalogApp.getDateRange(id);
            this.dateStart.updateValue(range.start || null);
            this.dateEnd.updateValue(range.end || null);
            this.loadAudit();
        }
    }
    //endregion de la vista

    loadAudit()
    {
        if(this.model.permissions.list)
        {
            this.keysDataList={};
            this.dataList = Object.assign({});
            this.where="&where="+encodeURI("[['op':'ge','field':'dateCreated','value':'"+this.dateStart.value+"','type':'date'],['op':'lt','field':'dateCreated','value':'"+this.dateEnd.value+"','type':'date']]");
            this.loadData();
            this.url = localStorage.getItem('urlAPI')+this.endpoint+'?access_token='+localStorage.getItem('bearer')+'&tz='+(moment().format('Z')).replace(':','')+this.where;
        }
    }

    exportCSV()
    {
        CatalogApp.exportExcel('OperationsAudit');
    }

    public keysDataList:any={};
    public loadKeysDataList()
    {
        let that=this;
        if(this.getObjectKeys(this.keysDataList).length == 0)
        {
            this.getObjectKeys(this.dataList).forEach(key=>{
                that.keysDataList[key]=[];
                that.getObjectKeys(that.dataList[key][0]).forEach(subKey=>{
                    if(that.model.rules[subKey])
                        that.keysDataList[key].push(subKey);
                });
            });
        }
    }
    public getData(data,rule):any{
        if(rule.type == 'number')
            return parseFloat(data || '0');
        if(rule.type == 'date')
            return this.formatDate(data,rule.format);

        return data;
    }
    
}
