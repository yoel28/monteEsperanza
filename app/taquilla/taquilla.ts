import { Component } from '@angular/core';
import { Router,RouteParams }           from '@angular/router-deprecated';
import  {FormBuilder} from '@angular/common';
import { Http } from '@angular/http';
import {RecargaSave} from "../recarga/methods";
import {RestController} from "../common/restController";
import {Fecha} from "../utils/pipe";
import {globalService} from "../common/globalService";
import {ToastsManager} from "ng2-toastr/ng2-toastr";


@Component({
    selector: 'taquilla',
    pipes: [Fecha],
    templateUrl: 'app/taquilla/index.html',
    styleUrls: ['app/taquilla/style.css'],
    directives:[RecargaSave]
})
export class Taquilla extends RestController{
    dataCompany:any = {};
    dataCompanies:any = {};
    search;

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
            this.dataCompanies = {};
            this.dataCompany={};
            this.httputils.onLoadList("/search/companies/" + companies + "?max=" + this.max + "&offset=" + this.offset, this.dataCompanies, this.max, this.error);
        }
    }
    assignRecarga(data){
        this.dataCompanies.balance+=data.quantity;
        this.dataList.list.unshift(data);
    }
}



