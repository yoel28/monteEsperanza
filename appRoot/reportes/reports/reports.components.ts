import {Search} from "../../utils/search/search";
import {Tooltip} from "../../utils/tooltips/tooltips";
import {OnInit, Component} from "@angular/core";
import {RestController} from "../../common/restController";
import {Http} from "@angular/http";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {globalService} from "../../common/globalService";
import {MCompany} from "../../empresa/MCompany";
import {DateRangeComponent} from "../../com.zippyttech.ui/components/date-range/date-range";

declare var SystemJS:any;
declare var moment:any;

@Component({
    selector: 'reports-view',
    templateUrl: SystemJS.map.app+'/reportes/reports/index.html',
    styleUrls: [SystemJS.map.app+'/reportes/reports/style.css'],
    directives : [Search,Tooltip,DateRangeComponent]
})

export class ReportsComponents extends RestController implements OnInit {

    public titles:string;
    public client:any;
    public cliente:any={};
    public url:string;



    constructor(public http: Http,toastr:ToastsManager,public myglobal:globalService) {
        super(http,toastr);
        this.titles="Informes";
        this.client = new MCompany(this.myglobal);
    }

    ngOnInit(){

    }

    assignSearch(data){
        Object.assign(this.cliente,data);
        this.loadRange();
    }

    public date:any;
    loadRange(date=null){
        if(date)
            this.date = date;
            let tempWhere =[];
        if(this.cliente && this.cliente.id){

            tempWhere.push({'op':'eq','field':'company.id','value':this.cliente.id});

        }
        if(this.date && this.date.start && this.date.end)
        {
            tempWhere.push({'value':this.date.start,'field':'dateCreated','type':'date','op':'ge'});
            tempWhere.push({'value':this.date.end,'field':'dateCreated','type':'date','op':'le'});
        }
        this.where = "&where="+encodeURI(JSON.stringify(tempWhere).split('{').join('[').split('}').join(']'));
    }

    public getUrl(endpoint:string,type='pdf'){
        return localStorage.getItem('urlAPI') +
                endpoint +
                '?access_token=' + localStorage.getItem('bearer') +
                '&tz=' + (moment().format('Z')).replace(':', '') +
                '&formatType='+type+
                this.where;
    }


}