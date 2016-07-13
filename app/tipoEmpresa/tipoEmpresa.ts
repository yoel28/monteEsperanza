import { Component} from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import {RestController} from "../common/restController";
import {TipoEmpresaSave} from "./methods";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {globalService} from "../common/globalService";
import {Xeditable} from "../common/xeditable";
import {Filter} from "../utils/filter/filter";

@Component({
    selector: 'tipoEmpresa',
    templateUrl: 'app/tipoEmpresa/index.html',
    styleUrls: ['app/tipoEmpresa/style.css'],
    directives: [TipoEmpresaSave,Xeditable,Filter],
})
export class TipoEmpresa extends RestController{

    public dataSelect:any={};

    public rules={
        'id': {'type':'number','disabled':true,'display':false,'title':'id','placeholder':'Identificador','search':true},
        'title':{'type':'text','display':null,'title':'Titulo','placeholder':'Titulo','search':true},
        'detail':{'type':'text','display':null,'title':'nombre','placeholder':'Detalle','search':true},
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
        if (this.myglobal.existsPermission('36')) {
            this.loadData();
        }
    }
    assignTipoEmpresa(data){
        this.dataList.list.unshift(data);
        this.dataList.list.pop();
    }
    //Cargar Where del filter
    public paramsFilter:any = {
        title: "Filtrar tipos de empresas",
        idModal: "modalFilter",
        endpointForm: "",
    };

    loadWhere(where) {
        this.where = where;
        if (this.myglobal.existsPermission('36')) {
            this.loadData();
        }
    }
}