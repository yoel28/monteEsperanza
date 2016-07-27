import { Component } from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import {RestController} from "../common/restController";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {Xeditable} from "../common/xeditable";
import {Filter} from "../utils/filter/filter";
import {globalService} from "../common/globalService";
import {Save} from "../utils/save/save";

@Component({
    selector: 'antenna',
    templateUrl: 'app/antena/index.html',
    styleUrls: ['app/antena/style.css'],
    directives:[Xeditable,Filter,Save]
})
export class Antenna extends RestController{

    public dataSelect:any={};
    public title="Antenas"

    constructor(public router: Router,public http: Http,public toastr: ToastsManager,public myglobal:globalService) {
        super(http,toastr);
        this.setEndpoint("/antennas/")
    }
    public params = {
        title: "Antenas",
        idModal: "saveAntenna",
        endpoint: "/antennas/",
    };

    public rules={
        'reference':{
            'type':'text',
            'icon':'fa fa-list',
            'key':'reference',
            'required':true,
            'display':null,
            'title':'Referencia',
            'mode':'inline',
            'placeholder': 'Referencia',
            'search': true,
            'msg':{
                'error':'Este campo es obligatorio',
            }
        },
        'way':{
            'type':'select',
            'key':'way',
            'required':true,
            'display':null,
            'title':'Dirección',
            'mode':'inline',
            'placeholder': 'Dirección',
            'showbuttons':true,
            'search': true,
            'source': [
                {'value': 'entrada', 'text': 'entrada'},
                {'value': 'salida', 'text': 'salida'},
            ],
            'msg':{
                'error':'Este campo es obligatorio',
            }
        },
    };
    ngOnInit(){
        if(this.myglobal.existsPermission('143')){
            this.max = 10;
            this.loadData();
        }
    }
    assignAntenna(data){
        this.dataList.list.unshift(data);
        if(this.dataList.page.length > 1)
            this.dataList.list.pop();
    }
    //Cargar Where del filter
    public paramsFilter:any = {
        title: "Filtrar Antenas",
        idModal: "modalFilter",
        endpointForm: "",
    };
    loadWhere(where) {
        this.where = where;
        this.loadData();
    }

}