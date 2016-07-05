import { Component } from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import {RestController} from "../common/restController";
import {ParametroSave} from "./methods";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {Xeditable} from "../common/xeditable";

@Component({
    selector: 'parametro',
    templateUrl: 'app/parametro/index.html',
    styleUrls: ['app/parametro/style.css'],
    directives:[ParametroSave,Xeditable]
})
export class Parametro extends RestController{

    constructor(public router: Router,public http: Http,public toastr: ToastsManager) {
        super(http,toastr);
        this.setEndpoint('/params/');
    }
    public rules={
        'id': {'type':'text','disabled':true,'display':false,'title':'' },
        'key':{'type':'text','display':null,'title':'Key','mode':'inline'},
        'value':{'type':'text','display':null,'title':'Valor','mode':'inline' },
        'type':{'type':'select','display':null,'title':'Tipo','mode':'inline',
            'source': [
                {'value': 'String', 'text': 'String'},
                {'value': 'Long', 'text': 'Long'},
                {'value': 'Double', 'text': 'Double'},
                {'value': 'Date', 'text': 'Date'},
            ]
        },
    };
    ngOnInit(){
        this.max = 10;
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
    assignParametro(data){
        this.dataList.list.unshift(data);
        this.dataList.list.pop();
    }

}