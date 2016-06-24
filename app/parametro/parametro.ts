import { Component } from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import {RestController} from "../common/restController";
import {ParametroSave} from "./methods";

@Component({
    selector: 'parametro',
    templateUrl: 'app/parametro/index.html',
    styleUrls: ['app/parametro/style.css'],
    directives:[ParametroSave]
})
export class Parametro extends RestController{

    constructor(public router: Router,public http: Http) {
        super(http);
        this.validTokens();
        this.setEndpoint('/params/');
        this.loadData();
    }
    validTokens(){
        if(!localStorage.getItem('bearer'))
        {
            let link = ['AccountLogin', {}];
            this.router.navigate(link);
        }
    }
    assignParametro(data){
        this.dataList.list.push(data);
    }

}