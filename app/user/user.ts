import { Component } from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http} from '@angular/http';
import {RestController} from "../common/restController";
import {globalService} from "../common/globalService";
import {UserSave} from "./methods";

@Component({
    selector: 'user',
    templateUrl: 'app/user/index.html',
    styleUrls: ['app/user/style.css'],
    directives: [UserSave],

})
export class User extends RestController{

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

}