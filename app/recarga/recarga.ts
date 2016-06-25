import { Component } from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import {RestController} from "../common/restController";
import {RecargaSave} from "./methods";
import {Fecha} from "../utils/pipe";


@Component({
    selector: 'recarga',
    pipes: [Fecha],
    templateUrl: 'app/recarga/index.html',
    styleUrls: ['app/recarga/style.css'],
    directives:[RecargaSave]
})
export class Recarga extends RestController{
    
    constructor(public router: Router,public http: Http) {
        super(http);
        this.validTokens();
        this.setEndpoint('/recharges/');
        this.loadData();
    }
    validTokens(){
        if(!localStorage.getItem('bearer'))
        {
            let link = ['AccountLogin', {}];
            this.router.navigate(link);
        }
    }
    assignRecarga(data){
        this.dataList.list.push(data);
    }
}
