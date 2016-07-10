import { Component} from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import {RestController} from "../common/restController";
import {TipoEmpresaSave} from "./methods";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {globalService} from "../common/globalService";
import {Xeditable} from "../common/xeditable";

@Component({
    selector: 'tipoEmpresa',
    templateUrl: 'app/tipoEmpresa/index.html',
    styleUrls: ['app/tipoEmpresa/style.css'],
    directives: [TipoEmpresaSave,Xeditable],
})
export class TipoEmpresa extends RestController{
    public rules={
        'id': {'type':'number','disabled':true,'display':false,'title':'id','placeholder':'Identificador','search':true},
        'title':{'type':'text','display':null,'title':'Titulo','placeholder':'Titulo','search':true},
        'detail':{'type':'text','display':null,'title':'nombre','placeholder':'Nombre de usuario','search':true},
        'icon':{'type':'select','display':null,'title':'Icono','mode':'inline',
            'source': [
                {'value': 'fa fa-building', 'text':'building'},
                {'value': 'fa fa-building-o', 'text': 'building-o'},
                {'value': 'fa fa-home', 'text': 'home'},
            ]
        },
    }
    constructor(public router: Router,public http: Http,toastr:ToastsManager,public myglobal:globalService) {
        super(http,toastr);
        this.setEndpoint('/type/companies/');
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