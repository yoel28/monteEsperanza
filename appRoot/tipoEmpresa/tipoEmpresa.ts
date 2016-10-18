import {Component, OnInit} from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import {RestController} from "../common/restController";
import {TipoEmpresaSave} from "./methods";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {globalService} from "../common/globalService";
import {Xeditable} from "../common/xeditable";
import {Filter} from "../utils/filter/filter";
declare var SystemJS:any;

@Component({
    selector: 'tipoEmpresa',
    templateUrl: SystemJS.map.app+'/tipoEmpresa/index.html',
    styleUrls: [SystemJS.map.app+'/tipoEmpresa/style.css'],
    directives: [TipoEmpresaSave,Xeditable,Filter],
})
export class TipoEmpresa extends RestController implements OnInit{

    public dataSelect:any={};

    public rules={
        'title':{'type':'text','display':null,'title':'Titulo','placeholder':'Titulo','search':true},
        'code':{'type':'text','display':null,'title':'Código','placeholder':'Código','search':true},
        'detail':{'type':'text','display':null,'title':'nombre','placeholder':'Detalle','search':true},
        'free':{'type':'select','display':null,'title':'Libre','mode':'inline',
            'source': [
                {'value': true, 'text':'Libre'},
                {'value': false, 'text': 'Pago'},
            ]
        },
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
            this.max=20;
            this.loadData();
        }
    }
    assignTipoEmpresa(data){
        this.dataList.list.unshift(data);
        if(this.dataList.page.length > 1)
            this.dataList.list.pop();
    }
    //Cargar Where del filter
    public paramsFilter:any = {
        title: "Filtrar tipos de empresas",
        idModal: "modalFilter",
        endpoint: "",
    };

    loadWhere(where) {
        this.where = where;
        if (this.myglobal.existsPermission('36')) {
            this.loadData();
        }
    }
}