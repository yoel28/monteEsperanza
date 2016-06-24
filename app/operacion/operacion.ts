import { Component } from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import {RestController} from "../common/restController";
import  {OperacionSave} from "./methods";
import {ToastsManager} from "ng2-toastr/ng2-toastr";

@Component({
    selector: 'operacion',
    templateUrl: 'app/operacion/index.html',
    styleUrls: ['app/operacion/style.css'],
    directives:[OperacionSave]
})
export class Operacion extends RestController{

    constructor(public router: Router,public http: Http,public toastr: ToastsManager) {
        super(http,toastr);
        this.validTokens();
        this.setEndpoint('/operations/');
        this.loadData();
    }

    validTokens(){
        if(!localStorage.getItem('bearer'))
        {
            let link = ['AccountLogin', {}];
            this.router.navigate(link);
        }
    }
    assignOperacion(data){
        this.dataList.list.push(data);
    }
    
}