import {Component, OnInit} from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import {RestController} from "../common/restController";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {Xeditable} from "../common/xeditable";
import {Filter} from "../utils/filter/filter";
import {globalService} from "../common/globalService";
import {Save} from "../utils/save/save";

@Component({
    selector: 'ruta',
    templateUrl: 'app/ruta/index.html',
    styleUrls: ['app/ruta/style.css'],
    directives:[Xeditable,Filter,Save]
})
export class Ruta extends RestController implements OnInit{

    public dataSelect:any={};
    public title="Rutas";

    constructor(public router: Router,public http: Http,public toastr: ToastsManager,public myglobal:globalService) {
        super(http,toastr);
        this.setEndpoint("/routes/")
    }
    public params = {
        title: "Rutas",
        idModal: "save",
        endpoint: "/routes/",
    };

    public rules={
        'title':{
            'type':'text',
            'icon':'fa fa-font',
            'key':'title',
            'required':true,
            'display':null,
            'maxLength':'35',
            'title':'Título',
            'mode':'inline',
            'placeholder': 'Título',
            'search': true,
            'msg':{
                'error':'El título contiene errores',
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
            'icon':'fa fa-font',
            'key':'detail',
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
        if(this.myglobal.existsPermission('151')){
            this.max = 10;
            this.loadData();
        }
    }
    assignRuta(data){
        this.dataList.list.unshift(data);
        if(this.dataList.page.length > 1)
            this.dataList.list.pop();
    }
    //Cargar Where del filter
    public paramsFilter:any = {
        title: "Filtrar rutas",
        idModal: "modalFilter",
        endpointForm: "",
    };
    loadWhere(where) {
        this.where = where;
        this.loadData();
    }

}