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
    selector: 'tipo-basura',
    templateUrl: 'app/tipoBasura/index.html',
    styleUrls: ['app/tipoBasura/style.css'],
    directives:[Xeditable,Filter,Save]
})
export class TipoBasura extends RestController{

    public dataSelect:any={};
    public title="Tipo de basura"

    constructor(public router: Router,public http: Http,public toastr: ToastsManager,public myglobal:globalService) {
        super(http,toastr);
        this.setEndpoint("/type/trash/")
    }
    public params = {
        title: "Tipo de basura",
        idModal: "saveTrashType",
        endpoint: "/type/trash/",
    }

    public rules={
        'title':{
            'type':'text',
            'key':'title',
            'icon':'fa fa-font',
            'required':true,
            'display':null,
            'title':'Título',
            'mode':'inline',
            'placeholder': 'Titulo',
            'msg':{
                'error':'El título contiene errores',
            },
            'search': true
        },
        'price':{
            'type':'number',
            'key':'price',
            'icon':'fa fa-money',
            'required':true,
            'display':null,
            'double':true,
            'title':'Precio',
            'mode':'inline',
            'placeholder': 'Precio',
            'search': true,
            'msg':{
                'error':'El precio debe ser numerico',
            }
        },
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
                'error':'la referencia contiene errores',
            }
        },
        'detail':{
            'type':'textarea',
            'key':'detail',
            'icon':'fa fa-list',
            'required':true,
            'display':null,
            'title':'Detalle',
            'mode':'inline',
            'placeholder': 'Detalle',
            'showbuttons':true,
            'search': true,
            'msg':{
                'error':'El detalle contiene errores',
            }
        },
    };
    ngOnInit(){
        if(this.myglobal.existsPermission('136')){
            this.max = 10;
            this.loadData();
        }

    }
    assignTipoBasura(data){
        this.dataList.list.unshift(data);
        if(this.dataList.page.length > 1)
            this.dataList.list.pop();
    }
    //Cargar Where del filter
    public paramsFilter:any = {
        title: "Filtrar tipos de basura",
        idModal: "modalFilter",
        endpointForm: "",
    };
    loadWhere(where) {
        this.where = where;
        this.loadData();
    }

}