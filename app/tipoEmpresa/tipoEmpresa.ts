import { Component} from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import {RestController} from "../common/restController";
import {TipoEmpresaSave} from "./tipoEmpresaSave";

@Component({
    selector: 'tipoEmpresa',
    templateUrl: 'app/tipoEmpresa/index.html',
    styleUrls: ['app/tipoEmpresa/style.css'],
    directives: [TipoEmpresaSave],
})
export class TipoEmpresa extends RestController{

    constructor(public router: Router,public http: Http) {
        super(http);
        this.validTokens();
        this.setEndpoint('/type/companies/');
        this.loadData();
    }
    validTokens(){
        if(!localStorage.getItem('bearer'))
        {
            let link = ['AccountLogin', {}];
            this.router.navigate(link);
        }
    }
}