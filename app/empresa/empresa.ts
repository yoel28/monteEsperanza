import { Component } from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import {RestController} from "../common/restController";
import {EmpresaSave} from "./methods";

@Component({
    selector: 'empresa',
    templateUrl: 'app/empresa/index.html',
    styleUrls: ['app/empresa/style.css'],
    directives:[EmpresaSave]
})
export class Empresa extends RestController{

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

}