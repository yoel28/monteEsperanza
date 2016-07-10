import { Component } from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import {RestController} from "../common/restController";
import {ReglaSave} from "./methods";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {globalService} from "../common/globalService";
import {Xeditable} from "../common/xeditable";

@Component({
    selector: 'regla',
    templateUrl: 'app/regla/index.html',
    styleUrls: ['app/regla/style.css'],
    directives : [ReglaSave,Xeditable]
})
export class Regla extends RestController{

    public rules={
        'id': {'type':'number','disabled':true,'display':false,'title':'id','placeholder':'Identificador','search':true},
        'rule':{'type':'text','display':null,'title':'Regla','placeholder':'regla','search':true},
        'name':{'type':'text','display':null,'title':'Nombre','placeholder':'Nombre','search':true},
    };

    constructor(public router: Router,public http: Http,toastr:ToastsManager,public myglobal:globalService) {
        super(http,toastr);
        this.setEndpoint('/rules/');
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
    assignRule(data){
        this.dataList.list.unshift(data);
    }
}