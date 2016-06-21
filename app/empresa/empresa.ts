import { Component } from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import {RestController} from "../common/restController";
import {EmpresaSave} from "./methods";
import {TipoEmpresaSave} from "../tipoEmpresa/methods";
import {Search} from "../utils/search/search";
@Component({
    selector: 'empresa',
    templateUrl: 'app/empresa/index.html',
    styleUrls: ['app/empresa/style.css'],
    directives:[EmpresaSave,TipoEmpresaSave,Search]
})
export class Empresa extends RestController{

    public dataSelect:string;

    public searchTipoEmpresa={
        title:"Tipo Empresa",
        idModal:"searchTipoEmpresa",
        endpointForm:"/search/type/companies/",
        placeholderForm:"Ingrese el tipo empresa",
        labelForm:{name:"Nombre: ",detail:"Detalle: "},
    }

    constructor(public router: Router,public http: Http) {
        super(http);
        this.validTokens();
        this.setEndpoint('/companies/');
        this.loadData();
    }
    validTokens(){
        if(!localStorage.getItem('bearer'))
        {
            let link = ['AccountLogin', {}];
            this.router.navigate(link);
        }
    }
    assignTipoEmpresa(data){
        let index = this.dataList.list.findIndex(obj => obj.id == this.dataSelect);
        this.onPatch('companyType',this.dataList.list[index],data.id);
    }
    assignEmpresa(data){
        this.dataList.list.push(data);
    }
    goTaquilla(companyRuc:string)
    {
        let link = ['TaquillaSearh', {search:companyRuc}];
        this.router.navigate(link);
    }
}