import { Component } from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import {RestController} from "../common/restController";
import  {OperacionSave} from "./methods";

@Component({
    selector: 'operacion',
    templateUrl: 'app/operacion/index.html',
    styleUrls: ['app/operacion/style.css'],
    directives:[OperacionSave]
})
export class Operacion extends RestController{

    constructor(public router: Router,public http: Http) {
        super(http);
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