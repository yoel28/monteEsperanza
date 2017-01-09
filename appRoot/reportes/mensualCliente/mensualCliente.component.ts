import {Component, OnInit} from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import moment from 'moment/moment';
import {Search} from "../../utils/search/search";
import {Tooltip} from "../../utils/tooltips/tooltips";
import {RestController} from "../../common/restController";
import {globalService} from "../../common/globalService";
import {MCompany} from "../../empresa/MCompany";
import {FindRangeDate} from "../../utils/components/findRangeDate/findRangeDate";

declare var SystemJS:any;
declare var Table2Excel:any;
declare var jQuery:any;

@Component({
    selector: 'reporte-cliente-mensual',
    templateUrl: SystemJS.map.app+'/reportes/mensualCliente/index.html',
    styleUrls: [SystemJS.map.app+'/reportes/mensualCliente/style.css'],
    directives : [FindRangeDate,Search,Tooltip]
})
export class ReporteClienteMensual extends RestController implements OnInit{

    public title:string;
    public url:string;
    public valueSearch:any={};
    public client:any;

    constructor(public router: Router,public http: Http,toastr:ToastsManager,public myglobal:globalService) {
        super(http,toastr);
        this.setEndpoint('/operations/monthly');
    }
    ngOnInit(){
        this.client = new MCompany(this.myglobal);
        this.title="REPORTE MENSUAL POR CLIENTE";
        this.initForm();
    }

    initForm(){}

    public date:any;
    loadRange(date=null){
        if(date)
            this.date = date.value;

        if(this.valueSearch && this.valueSearch.id){
            let tempWhere =[];
            tempWhere.push({'op':'eq','field':'company.id','value':this.valueSearch.id});
            if(this.date && this.date.start && this.date.end)
            {
                tempWhere.push({'value':this.date.start,'field':'dateCreated','type':'date','op':'ge'});
                tempWhere.push({'value':this.date.end,'field':'dateCreated','type':'date','op':'le'});
            }
            this.where = "&where="+encodeURI(JSON.stringify(tempWhere).split('{').join('[').split('}').join(']'));

            this.url = localStorage.getItem('urlAPI') + this.endpoint + '?access_token=' + localStorage.getItem('bearer') + '&tz=' + (moment().format('Z')).replace(':', '') + this.where;
        }
    }
    assignSearch(data){
        Object.assign(this.valueSearch,data);
        this.loadRange();
    }
    isValid():boolean{
        if(this.valueSearch && this.valueSearch.title)
            return true;
        return false;
    }

}