import { Component } from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import {RestController} from "../common/restController";
import {ReglaSave} from "./methods";

@Component({
    selector: 'regla',
    templateUrl: 'app/regla/index.html',
    styleUrls: ['app/regla/style.css'],
    directives : [ReglaSave]
})
export class Regla extends RestController{

    constructor(public router: Router,public http: Http) {
        super(http);
        this.validTokens();
        this.setEndpoint('/rules/');
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