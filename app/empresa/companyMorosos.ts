import {Component, OnInit} from "@angular/core";
import {RestController} from "../common/restController";
import {Router, RouteParams} from "@angular/router-deprecated";
import {Http} from "@angular/http";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {globalService} from "../common/globalService";
@Component({
    selector: 'empresa-moroso',
    templateUrl: 'app/empresa/morosos.html',
    styleUrls: ['app/empresa/style.css'],
})
export class EmpresaMorosos extends RestController implements OnInit {
    public viewOptions:any={};
    public permissions:any={};

    constructor(public router:Router, http:Http, public toastr:ToastsManager, public myglobal:globalService) {
        super(http,toastr);
        this.setEndpoint('/companies/');

    }
    ngOnInit(){
        this.where="&where="+encodeURI("[['op':'lt','field':'balance','value':0d]]");
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
        this.permissions['list']=this.myglobal.existsPermission('');
    }


    goTaquilla(companyId:string) {
        let link = ['TaquillaSearh', {search: companyId}];
        this.router.navigate(link);
    }
}
