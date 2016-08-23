import {Component,  OnInit} from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import {RestController} from "../common/restController";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import moment from 'moment/moment';
import {globalService} from "../common/globalService";
declare var jQuery:any;

@Component({
    selector: 'caja',
    templateUrl: 'app/recarga/caja.html',
    styleUrls: ['app/recarga/style.css'],
})
export class Caja extends RestController implements OnInit{

    public MONEY_METRIC_SHORT=this.myglobal.getParams('MONEY_METRIC_SHORT');
    public MONEY_METRIC=this.myglobal.getParams('MONEY_METRIC');
    public rechargeTotal={};
    public typeRecharge:any={};
    public hoy="";

    constructor(public router: Router,public http: Http,public toastr: ToastsManager,public myglobal:globalService) {
        super(http,toastr);
        this.setEndpoint('/search/recharges/');
    }
    ngOnInit(){
        if(this.myglobal.existsPermission('109')){
            this.max = 1000;
            this.hoy = moment().format('DD-MM-YYYY');
            let manana = moment().add(1, 'days').format('DD-MM-YYYY');
            this.where="&where="+encodeURI("[['op':'ge','field':'dateCreated','value':'"+this.hoy+"','type':'date'],['op':'lt','field':'dateCreated','value':'"+manana+"','type':'date']]");
            this.loadData();
            this.httputils.onLoadList('/total/recharges?max=1000'+this.where,this.rechargeTotal,this.max,this.error);
            this.httputils.onLoadList('/type/recharges?max=1000',this.typeRecharge,this.max,this.error);

        }
    }
    formatDate(date,format){
        if(date)
            return moment(date).format(format);
        return "";
    }
    exportCSV(){
        jQuery("#content").tableToCSV();
    }
    public typeRechargeIndex:any={};
    calcRecharges(){
        let that = this;
        if(this.typeRecharge.list){
            that.typeRechargeIndex={};
            this.typeRecharge.list.forEach((obj,index)=>{
                that.typeRechargeIndex[obj.id]=index;
                obj['total']=0.0;
            })
            this.dataList.list.forEach(obj=>{
                that.typeRecharge.list[that.typeRechargeIndex[obj.rechargeTypeId]].total+=obj.quantity;
            })
        }
    }
}
