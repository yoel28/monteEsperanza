import {Component, ViewChild} from '@angular/core';
import { Router,RouteParams }           from '@angular/router-deprecated';
import  {FormBuilder} from '@angular/common';
import { Http } from '@angular/http';
import {RecargaSave} from "../recarga/methods";
import {RestController} from "../common/restController";
import {Fecha} from "../utils/pipe";
import {globalService} from "../common/globalService";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {OperacionPrint} from "../operacion/methods";


@Component({
    selector: 'taquilla',
    pipes: [Fecha],
    templateUrl: 'app/taquilla/index.html',
    styleUrls: ['app/taquilla/style.css'],
    directives:[RecargaSave,OperacionPrint]
})
export class Taquilla extends RestController{
    dataCompany:any = {};
    dataCompanies:any = {};
    search;
    public MONEY_METRIC_SHORT=this.myglobal.getParams('MONEY_METRIC_SHORT');
    public MONEY_METRIC=this.myglobal.getParams('MONEY_METRIC');


    constructor(public params:RouteParams,public router: Router,http: Http,_formBuilder: FormBuilder,public toastr: ToastsManager,public myglobal:globalService) {
        super(http,toastr);
    }
    ngOnInit(){
        if(this.params.get('search'))
        {
            if(this.myglobal.existsPermission('80'))
                this.getCompany(this.params.get('search'));
        }
    }
    getCompany(companyId:string){
        if(this.myglobal.existsPermission('80')){
            let successCallback= response => {
                Object.assign(this.dataCompany, response.json());
                this.loadData();
            }
            this.httputils.doGet("/companies/"+companyId,successCallback,this.error)
            this.dataCompanies = {};
        }
    }
    loadData(offset=0){
        if(this.myglobal.existsPermission('109')) {
            this.offset = offset;
            this.endpoint = "/search/recharges";
            let where = encodeURI("[['op':'eq','field':'company.id','value':" + this.dataCompany.id + "l]]")
            this.httputils.onLoadList(this.endpoint + "?where=" + where + "&max=" + this.max + "&offset=" + this.offset, this.dataList, this.max, this.error);
        }
    };

    getCompanies(companies:string,offset=0){
        if(this.myglobal.existsPermission('80')) {
            this.offset = offset;
            this.max=5;
            this.dataCompanies = {};
            this.dataCompany={};
            this.httputils.onLoadList("/search/companies/" + companies + "?max=" + this.max + "&offset=" + this.offset, this.dataCompanies, this.max, this.error);
        }
    }
    assignRecarga(data){
        this.dataCompany.balance+=data.quantity;
        this.dataList.count+=1;
        this.dataList.list.unshift(data);
    }
    onPrint(event){
        event.preventDefault();
        var printContents = document.getElementById("taquilla").innerHTML;
        var popupWin = window.open('', '_blank');
        popupWin.document.open();
        popupWin.document.write('<body onload="window.print()">' + printContents + '</body>');
        popupWin.document.head.innerHTML = (document.head.innerHTML);
        popupWin.document.close();

    }
    loadAll(event){
        event.preventDefault();
        this.max = this.dataList.count||1000;
        this.loadData();
    }
    @ViewChild(OperacionPrint)
    operacionPrint:OperacionPrint;
    onPrintOperation(data){
        let successCallback= response => {
            if(this.operacionPrint)
                this.operacionPrint.data=response.json();
        };
        this.httputils.doGet('/operations/'+data.operationId,successCallback,this.error)
    }
}



