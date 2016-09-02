import {Component, OnInit} from "@angular/core";
import {Router, RouteParams} from "@angular/router-deprecated";
import {Http} from "@angular/http";
import {RestController} from "../common/restController";
import {EmpresaSave} from "./methods";
import {TipoEmpresaSave} from "../tipoEmpresa/methods";
import {Search} from "../utils/search/search";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {RecargaTimeLine} from "../recarga/methods";
import {Xeditable, Xfile, Xcropit} from "../common/xeditable";
import {Divide} from "../utils/pipe";
import {globalService} from "../common/globalService";
import {Filter} from "../utils/filter/filter";

@Component({
    selector: 'empresa',
    pipes: [Divide],
    templateUrl: 'app/empresa/index.html',
    styleUrls: ['app/empresa/style.css'],
    directives: [EmpresaSave, TipoEmpresaSave, Search, Xeditable, Xfile, Xcropit,Filter]
})
export class Empresa extends RestController implements OnInit {

    constructor(public router:Router, public http:Http, public toastr:ToastsManager, public myglobal:globalService) {
        super(http, toastr);
        this.setEndpoint('/companies/');
    }

    ngOnInit() {
        if (this.myglobal.existsPermission('80')) {
            this.max = 12;
            this.loadData();
        }
    }

    public rules = {
        'name': {
            'type': 'text',
            'display': null,
            'title': 'Nombre del cliente',
            'placeholder': 'Nombre',
            'mode': 'inline',
            'search': true
        },
        'ruc': {
            'type': 'text',
            'display': null,
            'title': 'Ruc del cliente',
            'mode': 'inline',
            'placeholder': 'RUC',
            'search': true
        },
        'code': {
            'type': 'text',
            'display': null,
            'title': 'Codigo del cliente',
            'mode': 'inline',
            'placeholder': 'Código',
            'search': true
        },
        'responsiblePerson': {
            'type': 'text',
            'display': null,
            'title': 'Persona Responsable',
            'placeholder': 'Responsable',
            'mode': 'inline',
            'search': true
        },
        'phone': {
            'type': 'number',
            'display': null,
            'title': 'Teléfono',
            'placeholder': 'Teléfono',
            'mode': 'inline',
            'search': false
        },
        'minBalance': {
            'type': 'number',
            'display': null,
            'title': 'Balance mínimo',
            'placeholder': 'Balance mínimo',
            'mode': 'inline',
            'search': true
        },
        'balance': {
            'type': 'number',
            'display': null,
            'title': 'Balance',
            'placeholder': 'Balance',
            'double':true,
            'mode': 'inline',
            'search': true
        },
        'address': {
            'type': 'text',
            'display': null,
            'title': 'Dirección',
            'mode': 'inline',
            'placeholder': 'Dirección',
            'search': true
        },
    };

    public dataSelect:any={};

    public searchTipoEmpresa = {
        title: "Grupo",
        idModal: "searchTipoEmpresa",
        endpointForm: "/search/type/companies/",
        placeholderForm: "Ingrese el grupo",
        labelForm: {name: "Nombre: ", detail: "Detalle: "},
    }

    assignTipoEmpresa(data) {
        let index = this.dataList.list.findIndex(obj => obj.id == this.dataSelect);
        this.onPatch('companyType', this.dataList.list[index], data.id);
    }

    assignEmpresa(data) {
        this.dataList.list.unshift(data);
        if(this.dataList.page.length > 1)
            this.dataList.list.pop();
    }

    goTaquilla(companyRuc:string) {
        let link = ['TaquillaSearh', {search: companyRuc}];
        this.router.navigate(link);
    }

    goVehiculo(event,companyid:string) {
        event.preventDefault();
        let link = ['VehiculoCompany', {'companyId': companyid}];
        this.router.navigate(link);
    }

    goTimeLine(companyRuc:string) {
        let link = ['EmpresaTimeLine', {ruc: companyRuc}];
        this.router.navigate(link);
    }
    goMorosos(event){
        event.preventDefault();
        let link = ['EmpresaMorosos'];
        this.router.navigate(link);
    }

    //cambiar imagen de una empresa
    public image:any = [];

    changeImage(data, id) {
        if (this.image[id] == null)
            this.image[id] = [];
        this.image[id] = data;
    }

    loadImage(event, data) {
        event.preventDefault();
        this.onPatch('image', data, this.image[data.id]);
    }

    //Cargar Where del filter
    public paramsFilter:any = {
        title: "Filtrar empresas",
        idModal: "modalFilterCompanies",
        endpointForm: "",
    };

    loadWhere(where) {
        this.where = where;
        this.loadData();
    }

}

@Component({
    selector: 'empresa-timeline',
    templateUrl: 'app/empresa/timeLine.html',
    styleUrls: ['app/empresa/style.css'],
    directives: [RecargaTimeLine]
})
export class EmpresaTimeLine extends RestController {
    public paramsTimeLine = {
        'offset': 0,
        'max': 8,
        'ruc': ''
    };
    public dataCompany:any={};
    constructor(params:RouteParams, public router:Router, http:Http, public toastr:ToastsManager, public myglobal:globalService) {
        super(http,toastr);
        this.paramsTimeLine.ruc = params.get('ruc');
        this.getCompany(this.paramsTimeLine.ruc);
    }
    getCompany(companyRuc:string){
        if(this.myglobal.existsPermission('80')){
            let successCallback= response => {
                Object.assign(this.dataCompany, response.json().list[0]);
            }
            this.httputils.doGet("/companies/?where=[['op':'eq','field':'ruc','value':'"+companyRuc+"']]",successCallback,this.error)
        }
    }
}