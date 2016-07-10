import { Component } from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import {RestController} from "../common/restController";
import {RolSave} from "./methods";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {globalService} from "../common/globalService";
import {Xeditable} from "../common/xeditable";

@Component({
    selector: 'rol',
    templateUrl: 'app/rol/index.html',
    styleUrls: ['app/rol/style.css'],
    directives:[RolSave,Xeditable]
})
export class Rol extends RestController{

    public rules={
        'id': {'type':'number','disabled':true,'display':false,'title':'id','placeholder':'Identificador','search':true},
        'authority':{'type':'text','display':null,'title':'Titulo','placeholder':'authority','search':true},
    }
    constructor(public router: Router,public http: Http,toastr:ToastsManager,public myglobal:globalService) {
        super(http,toastr);
        this.setEndpoint('/roles/');
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
    assignRol(data){
        this.dataList.list.unshift(data);
    }

}