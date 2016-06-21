import { Component,EventEmitter } from '@angular/core';
import { Http} from '@angular/http';
import {RestController} from "../../common/restController";

@Component({
    selector: 'search',
    templateUrl: 'app/utils/search/index.html',
    styleUrls: ['app/utils/search/style.css'],
    inputs:['params'],
    outputs:['result'],
})
export class Search extends RestController{

    public params:any={};
    public result:any;

    constructor(public http:Http) {
        super(http);
        this.setEndpoint(this.params.endpointForm);
        this.result = new EventEmitter();
    }
    getSearch(search){
        //TODO: this.httputils.onLoadList(this.endpointForm+search,this.dataList,this.error);
        this.httputils.onLoadList(this.params.endpointForm,this.dataList,this.error);
    }
    getData(data){
        this.result.emit(data);
    }
}

