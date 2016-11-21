import {Component, OnInit, ViewChild} from "@angular/core";
import {RestController} from "../common/restController";
import {Router, RouteParams} from "@angular/router-deprecated";
import {Http} from "@angular/http";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {globalService} from "../common/globalService";
import {RecargaSave} from "../recarga/methods";
import {Tooltip} from "../utils/tooltips/tooltips";
declare var SystemJS:any;

@Component({
    selector: 'empresa-moroso',
    templateUrl: SystemJS.map.app+'/empresa/morosos.html',
    styleUrls: [SystemJS.map.app+'/empresa/style.css'],
    directives:[RecargaSave,Tooltip]
})
export class EmpresaMorosos extends RestController implements OnInit {
    public viewOptions:any={};
    public permissions:any={};

    constructor(public router:Router, http:Http, public toastr:ToastsManager, public myglobal:globalService) {
        super(http,toastr);
        this.setEndpoint('/companies/');

    }
    ngOnInit(){
        this.where="&where="+encodeURI("[['op':'lt','field':'debt','value':0d]]");
        this.max=15;

        this.initViewOptions();
        this.initPermisssions();

        if(this.permissions['list'])
            this.loadData();
    }
    initViewOptions(){
        this.viewOptions.title="Clientes morosos";
        this.viewOptions['errors']={};
        this.viewOptions['errors'].title="Advertencia";
        this.viewOptions['errors'].list="No tiene permisos para ver clientes";
        this.viewOptions['errors'].notItems="No se encontro ningun resultado";

    }
    initPermisssions(){
        this.permissions['list']=this.myglobal.existsPermission('80');
    }


    goTaquilla(companyId:string) {
        let link = ['TaquillaSearh', {search: companyId}];
        this.router.navigate(link);
    }
    
    public dataCompany:any={};
    @ViewChild(RecargaSave)
    recargaSave:RecargaSave;
    
    RecargarSaldo(data){
        this.dataCompany = data;
        if(this.recargaSave){
            this.recargaSave.idCompany=data.id;
            this.recargaSave.setdata(data.id,data.debt+data.balance)
        }

    }
    assignRecarga(data){
        this.dataCompany.balance+=data.quantity;
    }
}
