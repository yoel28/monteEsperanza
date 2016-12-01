import {Component, OnInit} from "@angular/core";
import {Router, RouteParams} from "@angular/router-deprecated";
import {Http} from "@angular/http";
import {RestController} from "../common/restController";
import {Search} from "../utils/search/search";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {RecargaTimeLine} from "../recarga/methods";
import {Xeditable, Xfile, Xcropit} from "../common/xeditable";
import {Divide} from "../utils/pipe";
import {globalService} from "../common/globalService";
import {Filter} from "../utils/filter/filter";
import {MCompany} from "./MCompany";
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";
import {Tables} from "../utils/tables/tables";
import {Save} from "../utils/save/save";
import {ControllerBase} from "../common/ControllerBase";
import {MCompanyType} from "../tipoEmpresa/MTypeCompany";
import {Tooltip} from "../utils/tooltips/tooltips";
import {MTrashType} from "../tipoBasura/MTrashType";
declare var SystemJS:any;

@Component({
    selector: 'company',
    templateUrl: SystemJS.map.app+'/empresa/index.html',
    styleUrls: [SystemJS.map.app+'/empresa/style.css'],
    providers: [TranslateService],
    directives: [Filter,Tables,Save, Search, Xeditable, Xfile, Xcropit,Filter,Tooltip],
    pipes: [Divide,TranslatePipe],
})
export class Empresa extends ControllerBase implements OnInit {

    public paramsTable:any={};
    public companyType:any={};
    public trashType:any={};

    constructor(public router:Router, public http:Http, public toastr:ToastsManager, public myglobal:globalService, public translate:TranslateService) {
        super('COMPANY', '/companies/',router, http, toastr, myglobal, translate);
    }
    ngOnInit(){
        this.initModel();
        this.initViewOptions();
        this.loadParamsTable();
        this.loadPage();
    }
    initModel() {
        this.model= new MCompany(this.myglobal);
        
        this.companyType = new MCompanyType(this.myglobal);
        this.trashType = new MTrashType(this.myglobal);
    }
    initViewOptions() {
        this.viewOptions["title"] = 'Cliente';
        this.viewOptions["buttons"]=[];
        this.viewOptions["buttons"].push({
            'visible': this.model.permissions.add,
            'title': 'Agregar',
            'class': 'btn btn-green',
            'icon': 'fa fa-save',
            'modal': this.model.paramsSave.idModal
        });

        this.viewOptions["buttons"].push({
            'visible': this.model.permissions.filter && this.model.permissions.list,
            'title': 'Filtrar',
            'class': 'btn btn-blue',
            'icon': 'fa fa-filter',
            'modal': this.model.paramsSearch.idModal
        });
    }
    loadParamsTable(){
        this.paramsTable.endpoint=this.endpoint;
        this.paramsTable.actions={};
        this.paramsTable.actions.delete = {
            "icon": "fa fa-trash",
            "exp": "",
            'title': 'Eliminar',
            'idModal': this.prefix+'_'+this.configId+'_del',
            'permission': this.model.permissions.delete,
            'message': '¿ Esta seguro de eliminar el cliente : ',
            'keyAction':'code'
        };
    }

    public typeView=1;


    public searchTipoEmpresa = {
        title: "Grupo",
        idModal: "searchTipoEmpresa",
        endpoint: "/search/type/companies/",
        placeholder: "Ingrese el grupo",
        label: {name: "Nombre: ", detail: "Detalle: "},
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

}

@Component({
    selector: 'empresa-timeline',
    templateUrl: SystemJS.map.app+'/empresa/timeLine.html',
    styleUrls: [SystemJS.map.app+'/empresa/style.css'],
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