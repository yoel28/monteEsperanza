import { Component } from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import {RestController} from "../common/restController";
import {TagSave} from "./methods";
import fill = require("core-js/fn/array/fill");
import forEach = require("core-js/fn/array/for-each");

@Component({
    selector: 'tagRfid',
    templateUrl: 'app/tagRfid/index.html',
    styleUrls: ['app/tagRfid/style.css'],
    directives:[TagSave],
})
export class TagRfid extends RestController{

    constructor(public router: Router,public http: Http) {
        super(http);
        this.validTokens();
        this.setEndpoint('/rfids/');
        this.loadData();

    }
    validTokens(){
        if(!localStorage.getItem('bearer'))
        {
            let link = ['AccountLogin', {}];
            this.router.navigate(link);
        }
    }
    assignTag(data){
        this.dataList.list.push(data);
    }
}