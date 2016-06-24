import { Component } from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import {RestController} from "../common/restController";
import {TagSave} from "./methods";
import fill = require("core-js/fn/array/fill");

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

        //this.page = Array(3).fill(4);//op op:ilike

    }
    public page:any;
    public arr:any=[];
    public num:number = 20;

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

    loadData(offset=0,max=5){
        event.preventDefault();
        this.httputils.onLoadList(this.endpoint+"?max="+max+"&offset="+offset,this.dataList,this.error);
    };

}