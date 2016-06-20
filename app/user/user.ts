import { Component } from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http} from '@angular/http';
import {RestController} from "../common/restController";
import {globalService} from "../common/globalService";
import {UserSave} from "./methods";
import {Search} from "../utils/search/search";
import {EmpresaSave} from "../empresa/methods";

@Component({
    selector: 'user',
    templateUrl: 'app/user/index.html',
    styleUrls: ['app/user/style.css'],
    directives: [UserSave,Search,EmpresaSave],
})
export class User extends RestController{
    
    public userSelect:string;

    constructor(public router: Router,public http: Http,public myglobal:globalService) {
        super(http);
        this.validTokens();
        this.setEndpoint('/users/');
        this.loadData();
    }
    validTokens(){
        if(!localStorage.getItem('bearer'))
        {
            let link = ['AccountLogin', {}];
            this.router.navigate(link);
        }
    }
    goTaquilla(companyRuc:string)
    {
        let link = ['TaquillaSearh', {search:companyRuc}];
        this.router.navigate(link);
    }


    public searchEmpresa={
        title:"Empresa",
        idModal:"searchEmpresa",
        endpointForm:"consultas/search.json",
        placeholderForm:"Ingrese el RUC de la empresa",
        labelForm:{name:"Nombre: ",detail:"Detalle: "},
    }

    assignCompany(data){
        let index = this.dataList.list.findIndex(obj => obj.id == this.userSelect);
        this.onPatch('company',this.dataList.list[index],data.id);
    }
   

}