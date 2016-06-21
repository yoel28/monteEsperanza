import { Component } from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import {RestController} from "../common/restController";
import {TipoRecargaSave} from "./methods";

@Component({
    selector: 'tipoRecarga',
    templateUrl: 'app/tipoRecarga/index.html',
    styleUrls: ['app/tipoRecarga/style.css'],
    directives: [TipoRecargaSave],

})
export class TipoRecarga extends RestController{
    
    constructor(public router: Router,public http: Http) {
        super(http);
        this.validTokens();
        this.setEndpoint('/type/recharges/');
        this.loadData();
    }
    validTokens(){
        if(!localStorage.getItem('bearer'))
        {
            let link = ['AccountLogin', {}];
            this.router.navigate(link);
        }
    }
    assignTipoRecarga(data){
        this.dataList.list.push(data);
    }
}