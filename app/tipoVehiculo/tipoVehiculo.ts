import { Component } from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import {RestController} from "../common/restController";
import {TipoVehiculoSave} from "./methods";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {globalService} from "../common/globalService";
import {Xeditable} from "../common/xeditable";

@Component({
    selector: 'tipoVehiculo',
    templateUrl: 'app/tipoVehiculo/index.html',
    styleUrls: ['app/tipoVehiculo/style.css'],
    directives: [TipoVehiculoSave,Xeditable],
})
export class TipoVehiculo extends RestController{

    public rules={
        'id': {'type':'number','disabled':true,'display':false,'title':'id','placeholder':'Identificador','search':true},
        'title':{'type':'text','display':null,'title':'Titulo','placeholder':'Titulo','search':true},
        'detail':{'type':'text','display':null,'title':'nombre','placeholder':'Nombre de usuario','search':true},
        'icon':{'type':'select','display':null,'title':'Icono','mode':'inline',
            'source': [
                {'value': 'fa fa-truck', 'text':'truck'},
                {'value': 'fa fa-car', 'text': 'car'},
                {'value': 'fa fa-bus', 'text': 'bus'},
                {'value': 'fa fa-taxi', 'text': 'taxi'},
            ]
        },
    }
    
    constructor(public router: Router,public http: Http,toastr:ToastsManager,public myglobal:globalService) {
        super(http,toastr);
        this.setEndpoint('/type/vehicles/');
    }
    ngOnInit(){
        this.validTokens();
        this.loadData();
    }
    validTokens(){
        if(!localStorage.getItem('bearer'))
        {
            let link = ['AccountLogin', {}];
            this.router.navigate(link);
        }
    }
    assignTipoEmpresa(data){
        this.dataList.list.unshift(data);
    }
}