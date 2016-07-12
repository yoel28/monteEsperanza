import {Component} from "@angular/core";
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
export class Empresa extends RestController {

    constructor(public router:Router, public http:Http, public toastr:ToastsManager, public myglobal:globalService) {
        super(http, toastr);
        this.setEndpoint('/companies/');
    }

    ngOnInit() {
        if (this.myglobal.existsPermission('80')) {
            this.max = 9;
            this.loadData();
        }
    }

    public rules = {
        'id': {
            'type': 'number',
            'disabled': true,
            'display': false,
            'title': 'id',
            'placeholder': 'Identificador',
            'search': true
        },
        'name': {
            'type': 'text',
            'display': null,
            'title': 'Nombre de la empresa',
            'placeholder': 'Nombre',
            'mode': 'inline',
            'search': true
        },
        'ruc': {
            'type': 'text',
            'display': null,
            'title': 'Ruc de la empresa',
            'mode': 'inline',
            'placeholder': 'RUC',
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
            'title': 'Telefono',
            'placeholder': 'Telefono',
            'mode': 'inline',
            'search': true
        },
        'address': {
            'type': 'text',
            'display': null,
            'title': 'Direccion',
            'mode': 'inline',
            'placeholder': 'Direccion',
            'search': true
        },
    };

    public dataSelect:string;

    public searchTipoEmpresa = {
        title: "Tipo Empresa",
        idModal: "searchTipoEmpresa",
        endpointForm: "/search/type/companies/",
        placeholderForm: "Ingrese el tipo empresa",
        labelForm: {name: "Nombre: ", detail: "Detalle: "},
    }

    assignTipoEmpresa(data) {
        let index = this.dataList.list.findIndex(obj => obj.id == this.dataSelect);
        this.onPatch('companyType', this.dataList.list[index], data.id);
    }

    assignEmpresa(data) {
        this.dataList.list.unshift(data);
        this.dataList.list.pop();
    }

    goTaquilla(companyRuc:string) {
        let link = ['TaquillaSearh', {search: companyRuc}];
        this.router.navigate(link);
    }

    goTimeLine(companyRuc:string) {
        let link = ['EmpresaTimeLine', {ruc: companyRuc}];
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
        title: "Filtrar Empresas",
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

    constructor(params:RouteParams, public router:Router, http:Http) {
        super(http);
        this.paramsTimeLine.ruc = params.get('ruc');
    }
}