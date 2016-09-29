import {Component,  OnInit} from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import {RestController} from "../common/restController";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import moment from 'moment/moment';
import {globalService} from "../common/globalService";
import {Datepicker} from "../common/xeditable";
declare var jQuery:any;
declare var SystemJS:any;

@Component({
    selector: 'caja',
    templateUrl: SystemJS.map.app+'/recarga/caja.html',
    styleUrls: [SystemJS.map.app+'/recarga/style.css'],
    directives:[Datepicker]
})
export class Caja extends RestController implements OnInit{

    public MONEY_METRIC_SHORT=this.myglobal.getParams('MONEY_METRIC_SHORT');
    public MONEY_METRIC=this.myglobal.getParams('MONEY_METRIC');
    public WEIGTH_METRIC_SHORT=this.myglobal.getParams('WEIGTH_METRIC_SHORT');
    public rechargeTotal={};
    public rechargeSum:any=[];
    public typeRecharge:any={};
    public dia:any;

    constructor(public router: Router,public http: Http,public toastr: ToastsManager,public myglobal:globalService) {
        super(http,toastr);
        this.setEndpoint('/search/recharges/');
    }
    ngOnInit(){
        if(this.myglobal.existsPermission('109')){
            this.max = 1000;
            this.dia = moment();
            this.loadCaja();
        }
    }

    loadCaja(){
        this.max=20;
        let hoy= this.dia.format('DD-MM-YYYY');
        let manana= this.dia.add(1, 'days').format('DD-MM-YYYY')

        this.where="&where="+encodeURI("[['op':'ge','field':'dateCreated','value':'"+hoy+"','type':'date'],['op':'lt','field':'dateCreated','value':'"+manana+"','type':'date']]");
        this.loadData();
        this.onloadData('/total/recharges/',this.rechargeTotal)
        this.httputils.onLoadList('/type/recharges?max=1000',this.typeRecharge,this.max,this.error);
        let where="&where="+encodeURI("[['op':'ge','field':'re.dateCreated','value':'"+hoy+"','type':'date'],['op':'lt','field':'re.dateCreated','value':'"+manana+"','type':'date']]");
        this.onloadData('/operations/sum',this.rechargeSum,null,null,where)
    }
    getRechargeSum(val){
        let index = this.rechargeSum.findIndex(obj => (obj.companyTypeCredit == val ));
        if(index > -1)
           return this.rechargeSum[index].quantity
        return 0;

    }
    formatDate(date,format){
        if(date)
            return moment(date).format(format);
        return "";
    }
    exportCSV(id,event?){
        if(event)
            event.preventDefault();
        this.getLoadDataAll([],null,null,0,1000,null,()=>{
                setTimeout(function(_id=id,_jQuery=jQuery){ _jQuery("#"+_id).tableToCSV();}, 3000)
            }
        )
    }
    goTaquilla(event, companyId:string) {
        event.preventDefault();
        let link = ['TaquillaSearh', {search: companyId}];
        this.router.navigate(link);
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
    
    public formatDateFact = {
        format: "dd-mm-yyyy",
        startDate:'01-01-2016',
        startView: 2,
        minViewMode: 0,
        maxViewMode: 2,
        language: "es",
        todayBtn: "linked",
        forceParse: false,
        autoclose: true,
        todayHighlight: true,
    }

    loadFechaFac(data) {
        this.dia=moment(data.date);
        this.loadCaja();
    }
}
