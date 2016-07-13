import { Component } from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import {RestController} from "../common/restController";
import {ParametroSave} from "./methods";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {Xeditable} from "../common/xeditable";
import {Filter} from "../utils/filter/filter";
import {globalService} from "../common/globalService";

@Component({
    selector: 'parametro',
    templateUrl: 'app/parametro/index.html',
    styleUrls: ['app/parametro/style.css'],
    directives:[ParametroSave,Xeditable,Filter]
})
export class Parametro extends RestController{

    constructor(public router: Router,public http: Http,public toastr: ToastsManager,public myglobal:globalService) {
        super(http,toastr);
        this.setEndpoint('/params/');
    }
    public rules={
        'id': {'type':'number','disabled':true,'display':false,'title':'','placeholder': 'Identificador', 'search': true},
        'key':{'type':'text','display':null,'title':'Key','mode':'inline','placeholder': 'Clave', 'search': true},
        'value':{'type':'text','display':null,'title':'Valor','mode':'inline','placeholder': 'Valor', 'search': true},
        'type':{'type':'select','display':null,'title':'Tipo','mode':'inline','placeholder': 'Tipo', 'search': true,
            'source': [
                {'value': 'String', 'text': 'String'},
                {'value': 'Long', 'text': 'Long'},
                {'value': 'Double', 'text': 'Double'},
                {'value': 'Date', 'text': 'Date'},
            ]
        },
    };
    ngOnInit(){
        if(this.myglobal.existsPermission('99')){
            this.max = 10;
            this.loadData();
        }

    }
    assignParametro(data){
        this.dataList.list.unshift(data);
        this.dataList.list.pop();
    }
    //Cargar Where del filter
    public paramsFilter:any = {
        title: "Filtrar Parametros",
        idModal: "modalFilter",
        endpointForm: "",
    };
    loadWhere(where) {
        this.where = where;
        this.loadData();
    }

}