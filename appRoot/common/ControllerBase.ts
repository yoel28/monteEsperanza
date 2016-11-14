import {Http} from "@angular/http";
import { Router }           from '@angular/router-deprecated';
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {globalService} from "../common/globalService";
import {TranslateService} from "ng2-translate/ng2-translate";
import {RestController} from "./restController";
import {CatalogApp} from "./catalogApp";

declare var humanizeDuration:any;
declare var moment:any;
export abstract class ControllerBase extends RestController {
    
    public formatDateId:any = {};
    public prefix = "DEFAULT";
    public configId = moment().valueOf();
    public viewOptions:any = {};
    public dateHmanizer = CatalogApp.dateHmanizer;
    public model:any={};
    public msg:any =  CatalogApp.msg;
    public dataSelect:any = {};
    
    constructor(prefix, endpoint,public router: Router, public http:Http, public toastr:ToastsManager, public myglobal:globalService, public translate:TranslateService) {
        super(http, toastr);
        this.setEndpoint(endpoint);
        this.prefix = prefix;
        this.initLang();
    }
    public initLang() {
        var userLang = navigator.language.split('-')[0];
        userLang = /(es|en)/gi.test(userLang) ? userLang : 'es';
        this.translate.setDefaultLang('en');
        this.translate.use(userLang);
    }
    
    abstract initModel();

    public getViewOptionsButtons() {
        let visible = [];
        this.viewOptions['buttons'].forEach(obj=> {
            if (obj.visible)
                visible.push(obj);
        })
        return visible;
    }
    public getViewOptionsActions() {
        let visible = [];
        Object.keys(this.viewOptions.actions).forEach(obj=> {
            if (this.viewOptions.actions[obj].visible)
                visible.push(obj);
        })
        return visible;
    }
    public getObjectKeys(data) {
        return Object.keys(data || {});
    }
    public formatDate(date, format, force = false, id = null) {
        if (date) {
            if (id && this.formatDateId[id])
                force = this.formatDateId[id].value;
            if (this.myglobal.getParams(this.prefix + '_DATE_FORMAT_HUMAN') == 'true' && !force) {
                var diff = moment().valueOf() - moment(date).valueOf();
                if (diff < parseFloat(this.myglobal.getParams('DATE_MAX_HUMAN'))) {
                    if (diff < 1800000)//menor a 30min
                        return 'Hace ' + this.dateHmanizer(diff, {units: ['m', 's']})
                    if (diff < 3600000) //menor a 1hora
                        return 'Hace ' + this.dateHmanizer(diff, {units: ['m']})
                    return 'Hace ' + this.dateHmanizer(diff, {units: ['h', 'm']})
                }
            }
            return moment(date).format(format);
        }
        return "-";
    }
    
    public changeFormatDate(id) {
        if (!this.formatDateId[id])
            this.formatDateId[id] = {'value': false};
        this.formatDateId[id].value = !this.formatDateId[id].value;
    }
    
    public viewChangeDate(date) {
        //<i *ngIf="viewChangeDate(data.rechargeReferenceDate)" class="fa fa-exchange" (click)="changeFormatDate(data.id)"></i>
        var diff = moment().valueOf() - moment(date).valueOf();
        return ((diff < parseFloat(this.myglobal.getParams('DATE_MAX_HUMAN'))) && this.myglobal.getParams(this.prefix + '_DATE_FORMAT_HUMAN') == 'true')
    }
    //enlace a restcontroller
    public setLoadData(data) {
        this.dataList.list.unshift(data);
        if (this.dataList.count >= this.max)
            this.dataList.list.pop();
    }
    
    public modalIn:boolean=true;
    
    public loadPage(event?,accept=false){
        if(event)
            event.preventDefault();

        if (!this.model.permissions.warning || accept) {
            this.modalIn=false;
            this.loadData();
        }
    }
    public setDataFieldReference(model,data,setNull=false,callback)
    {
        let value=null;
        let that = this;

        if(!setNull)//no colocar valor nulo
        {
            value=this.dataSelect.id;
            if(that.dataSelect[model.ruleObject.code]!=null && model.rules[this.model.ruleObject.key].unique)
                model.setDataField(that.dataSelect[model.ruleObject.code],this.model.ruleObject.key,null,callback,that.dataSelect).then(
                    response=>{
                        model.setDataField(data.id,that.model.ruleObject.key,value,callback,that.dataSelect);
                });
            else
                model.setDataField(data.id,that.model.ruleObject.key,value,callback,that.dataSelect);
        }
        else
            model.setDataField(data[model.ruleObject.code],that.model.ruleObject.key,null,callback,data);

    }
    public onDashboard(event){
        if(event)
            event.preventDefault();
        let link = ['Dashboard', {}];
        this.router.navigate(link);
    }
}