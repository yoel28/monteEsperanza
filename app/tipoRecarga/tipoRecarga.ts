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
        'icon':{'type':'select','display':null,'title':'Icono','mode':'inline',
            'source': [
                {'value':'fa fa-cc-amex','text':'American express'},
                {'value':'fa fa-cc-mastercard','text':'Master card'},
                {'value':'fa fa-credit-card','text':'Credit card'},
                {'value':'fa fa-cc-diners-club','text':'Diners club'},
                {'value':'fa fa-cc-paypal','text':'Paypal'},
                {'value':'fa fa-google-wallet','text':'Google wallet'},
                {'value':'fa fa-cc-discover','text':'Discover'},
                {'value':'fa fa-cc-stripe','text':'Stripe'},
                {'value':'fa fa-paypal','text':'Paypal'},
                {'value':'fa fa-cc-jcb','text':'Jcb'},
                {'value':'fa fa-cc-visa','text':'Visa'},
                {'value':'fa fa-money','text':'Money'},
                {'value':'fa fa-refresh','text':'Transfer'},
                {'value':'fa fa-reply','text':'Reply'}
            ]
        },

    }
    ngOnInit() {
        if(this.myglobal.existsPermission('116'))
            this.loadData();
    }

    assignTipoRecarga(data){
        this.dataList.list.unshift(data);
        if(this.dataList.page.length > 1)
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