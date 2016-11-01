import {Component, OnInit} from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import {RestController} from "../common/restController";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {Xeditable} from "../common/xeditable";
import {Filter} from "../utils/filter/filter";
import {globalService} from "../common/globalService";
import {Save} from "../utils/save/save";
import {Tooltip} from "../utils/tooltips/tooltips";
declare var SystemJS:any;

@Component({
    selector: 'tipo-basura',
    templateUrl: SystemJS.map.app+'/tipoBasura/index.html',
    styleUrls: [SystemJS.map.app+'/tipoBasura/style.css'],
    directives:[Xeditable,Filter,Save,Tooltip]
})
export class TipoBasura extends RestController implements OnInit{

    public dataSelect:any={};
    public title="Tipo de basura";

    public WEIGTH_METRIC_SHORT:string="";
    public WEIGTH_METRIC:string="";
    public MONEY_METRIC_SHORT:string="";
    public MONEY_METRIC:string="";

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
            'maxLength':'35',
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
        'min':{
            'type':'number',
            'key':'min',
            'icon':'fa fa-balance-scale',
            'required':true,
            'display':null,
            'double':true,
            'title':'Peso mínimo',
            'mode':'inline',
            'placeholder': 'Peso mínimo',
            'search': true,
            'msg':{
                'error':'Este campo es obligatorio y numerico',
            }
        },
        'minPrice':{
            'type':'number',
            'key':'minPrice',
            'icon':'fa fa-money',
            'required':true,
            'display':null,
            'double':true,
            'title':'Precio mínimo',
            'mode':'inline',
            'placeholder': 'Precio mínimo',
            'search': true,
            'msg':{
                'error':'Este campo es obligatorio y numerico',
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

            this.WEIGTH_METRIC_SHORT=this.myglobal.getParams('WEIGTH_METRIC_SHORT');
            this.WEIGTH_METRIC=this.myglobal.getParams('WEIGTH_METRIC');
            this.MONEY_METRIC_SHORT=this.myglobal.getParams('MONEY_METRIC_SHORT');
            this.MONEY_METRIC=this.myglobal.getParams('MONEY_METRIC');
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
        endpoint: "",
    };
    loadWhere(where) {
        this.where = where;
        this.loadData();
    }

}