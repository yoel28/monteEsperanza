import { Component } from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import {RestController} from "../common/restController";
import  {OperacionSave} from "./methods";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {Xeditable} from "../common/xeditable";

@Component({
    selector: 'operacion',
    templateUrl: 'app/operacion/index.html',
    styleUrls: ['app/operacion/style.css'],
    directives:[OperacionSave,Xeditable]
})
export class Operacion extends RestController{

    constructor(public router: Router,public http: Http,public toastr: ToastsManager) {
        super(http,toastr);
        this.setEndpoint('/operations/');
    }
    ngOnInit(){
        this.validTokens();
        this.max = 15;
        this.loadData();
    }

    public rules={
        'id': {'type':'text','disabled':true,'display':false,'title':'' },
        'weightIn':{'type':'number','display':null,'title':'Peso de Entrada','mode':'popup' },
        'weightOut':{'type':'number','display':null,'title':'Peso de Salida','mode':'popup'},
    };

    validTokens(){
        if(!localStorage.getItem('bearer'))
        {
            let link = ['AccountLogin', {}];
            this.router.navigate(link);
        }
    }
    assignOperacion(data){
        this.dataList.list.unshift(data);
        this.dataList.list.pop();
    }
    
}