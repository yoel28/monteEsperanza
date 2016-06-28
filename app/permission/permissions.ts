import { Component } from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import {RestController} from "../common/restController";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {PermisoSave} from "./methods";

@Component({
    selector: 'permission',
    templateUrl: 'app/permission/index.html',
    styleUrls: ['app/permission/style.css'],
    directives:[PermisoSave]
})
export class Permission extends RestController{

    constructor(public router: Router,public http: Http,public toastr: ToastsManager) {
        super(http,toastr);
        this.validTokens();
        this.setEndpoint('/permissions/');
        this.loadData();
    }
    validTokens(){
        if(!localStorage.getItem('bearer'))
        {
            let link = ['AccountLogin', {}];
            this.router.navigate(link);
        }
    }
    assignPermiso(data){
        this.dataList.list.unshift(data);
    }

}