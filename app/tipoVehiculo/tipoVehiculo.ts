import { Component } from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import {RestController} from "../common/restController";
import {TipoVehiculoSave} from "./methods";

@Component({
    selector: 'tipoVehiculo',
    templateUrl: 'app/tipoVehiculo/index.html',
    styleUrls: ['app/tipoVehiculo/style.css'],
    directives: [TipoVehiculoSave],
})
export class TipoVehiculo extends RestController{
    
    constructor(public router: Router,public http: Http) {
        super(http);
        this.validTokens();
        this.setEndpoint('/type/vehicles/');
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