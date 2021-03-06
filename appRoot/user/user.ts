import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router-deprecated";
import {Http} from "@angular/http";
import {RestController} from "../common/restController";
import {globalService} from "../common/globalService";
import {UserSave} from "./methods";
import {Search} from "../utils/search/search";
import {Filter} from "../utils/filter/filter";
import {EmpresaSave} from "../empresa/methods";
import {Xeditable, Xcropit, Xfile} from "../common/xeditable";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {Divide} from "../utils/pipe";
import {Tooltip} from "../utils/tooltips/tooltips";
import {Save} from "../utils/save/save";
import {MZone} from "../zone/MZone";
declare var SystemJS:any;
@Component({
    selector: 'user',
    pipes: [Divide],
    templateUrl: SystemJS.map.app+'/user/index.html',
    styleUrls: [SystemJS.map.app+'/user/style.css'],
    directives: [UserSave, Save, Search, EmpresaSave, Xeditable, Filter, Xcropit, Xfile,Tooltip],
})
export class User extends RestController implements OnInit{

    public dataSelect:any={};
    public typeView=1;

    private _zone:MZone;

    constructor(public router:Router, public http:Http, public myglobal:globalService, public toastr:ToastsManager) {
        super(http, toastr);
        this.setEndpoint('/users/');
    }

    ngOnInit() {
        if (this.myglobal.existsPermission('57')) {
            this.max = 6;
            this.loadData();
        }
        if (this.myglobal.existsPermission('48'))
            this.loadRoles();

        this._zone = new MZone(this.myglobal);
    }

    public rules = {
        'username': {
            'type': 'text',
            'display': null,
            'title': 'Nombre de usuario',
            'placeholder': 'Usuario',
            'search': true
        },
        'name': {
            'type': 'text',
            'display': null,
            'title': 'nombre',
            'placeholder': 'Nombre de usuario',
            'search': true
        },
        'email': {'type': 'text', 'email':true, 'display': null, 'title': 'Correo', 'placeholder': 'Correo', 'search': true},
        'password': {
            'type': 'password',
            'display': null,
            'title': 'Contraseña',
            'placeholder': 'Contraseña',
            'search': false,
            'showbuttons':true,
        },
        'phone': {'type': 'number', 'display': null, 'title': 'Telefono', 'placeholder': 'Teléfono', 'search': false},
        'roles': {
            'type': 'checklist',
            'display': null,
            'title': 'Rol',
            'mode': 'popup',
            'showbuttons': true,
            'placeholder': 'Roles',
            'search': false,
            'source': []
        },
    }
    public params:any = {
        title: "Filtrar Usuarios",
        idModal: "modalFilterUser",
        endpoint: "",
    };

    goTaquilla(companyRuc:string) {
        let link = ['TaquillaSearh', {search: companyRuc}];
        this.router.navigate(link);
    }

    goTimeLine(companyRuc:string) {
        let link = ['EmpresaTimeLine', {ruc: companyRuc}];
        this.router.navigate(link);
    }
    
    public searchEmpresa = {
        title: "Empresa",
        idModal: "searchEmpresa",
        endpoint: "/search/companies/",
        placeholder: "Ingrese el RUC de la empresa",
        label: {name: "Nombre: ", detail: "RUC: "},
    }

    public searchZone = {
        title: "Buscar zona",
        idModal: "searchZone",
        endpoint: "/search/zones/",
        placeholder: "Ingrese el código de la zona",
        label: {name: "Nombre: ", detail: "Código: "},
    }

    assignCompany(data) {
        let index = this.dataList.list.findIndex(obj => obj.id == this.dataSelect.id);
        this.onPatch('company', this.dataList.list[index], data.id);
    }

    assignZone(data){
        this.onPatch('zone', this.dataSelect, data.id);
    }
    releaseZone(data) {
        let body = JSON.stringify({'zone': null});
        return (this.httputils.onUpdate(this.endpoint + data.id, body, data, this.error));
    }


    releaseCompany(data) {
        let index = this.dataList.list.findIndex(obj => obj.id == data.id);
        let body = JSON.stringify({'company': null});
        return (this.httputils.onUpdate(this.endpoint + data.id, body, data, this.error));
    }

    assignUser(data) {
        this.dataList.list.unshift(data);
        if(this.dataList.page.length > 1)
            this.dataList.list.pop();
    }

    //Cargar Roles
    public dataRoles:any = [];

    loadRoles() {
        let that = this;
        let successCallback = response => {
            Object.assign(that.dataRoles, response.json());
            that.dataRoles.list.forEach(obj=> {
                that.rules.roles.source.push({'value': obj.id, 'text': obj.authority});
            });
        };
        this.httputils.doGet('/roles/?max=1000', successCallback, this.error)
    }

    //Cargar Where del filter
    loadWhere(where) {
        this.where = where;
        if (this.myglobal.existsPermission('57')) {
            this.loadData();
        }
    }

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
}