import { Component } from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import {RestController} from "../common/restController";
import {TipoRecargaSave} from "./methods";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {globalService} from "../common/globalService";
import {Filter} from "../utils/filter/filter";
import {Xeditable} from "../common/xeditable";

@Component({
    selector: 'tipoRecarga',
    templateUrl: 'app/tipoRecarga/index.html',
    styleUrls: ['app/tipoRecarga/style.css'],
    directives: [TipoRecargaSave,Xeditable,Filter],

})
export class TipoRecarga extends RestController{
    
    constructor(public router: Router,public http: Http, public toastr:ToastsManager, public myglobal:globalService) {
        super(http);
        this.setEndpoint('/type/recharges/');

    }
    public dataSelect:any={};
    public rules = {
        'id': {
            'type': 'number',
            'disabled': true,
            'display': false,
            'title': 'id',
            'placeholder': 'Identificador',
            'search': true
        },
        'title': {
            'type': 'text',
            'display': null,
            'title': 'Titulo',
            'placeholder': 'Titulo',
            'mode': 'inline',
            'search': true
        },
        'detail': {
            'type': 'text',
            'display': null,
            'title': 'Detalle',
            'placeholder': 'Detalle',
            'mode': 'inline',
            'search': true
        },
    }
    ngOnInit() {
        if(this.myglobal.existsPermission('116'))
            this.loadData();
    }

    assignTipoRecarga(data){
        this.dataList.list.unshift(data);
        this.dataList.list.pop();
    }
    //Cargar Where del filter
    public paramsFilter:any = {
        title: "Filtrar tipos de recargas",
        idModal: "modalFilter",
        endpointForm: "",
    };

    loadWhere(where) {
        this.where = where;
        if(this.myglobal.existsPermission('116'))
            this.loadData();
    }
}