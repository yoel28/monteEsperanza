import { Component } from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import {RestController} from "../common/restController";
import {RolSave} from "./methods";
import {ToastsManager} from "ng2-toastr/ng2-toastr";

@Component({
    selector: 'rol',
    templateUrl: 'app/rol/index.html',
    styleUrls: ['app/rol/style.css'],
    directives:[RolSave]
})
export class Rol extends RestController{

    constructor(public router: Router,public http: Http,public toastr: ToastsManager) {
        super(http,toastr);
        this.validTokens();
        this.setEndpoint('/roles/');
        this.loadData();
    }
    validTokens(){
        if(!localStorage.getItem('bearer'))
        {
            let link = ['AccountLogin', {}];
            this.router.navigate(link);
        }
    }
    assignRol(data){
        this.dataList.list.unshift(data);
    }

}