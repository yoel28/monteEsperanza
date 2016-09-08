import {Component, OnInit,ViewChild} from '@angular/core';
import {Router}           from '@angular/router-deprecated';
import {Http} from '@angular/http';
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {globalService} from "../../common/globalService";
import {ModelBase} from "../../common/modelBase";
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";
import {Operacion} from "../operacion";
import {OperacionSave, OperacionPrint} from "../methods";
import moment from "moment/moment";
import {Filter} from "../../utils/filter/filter";


@Component({
    selector: 'operacion-pendiente',
    templateUrl: 'app/operacion/pendiente/index.html',
    styleUrls: ['app/operacion/pendiente/style.css'],
    providers: [TranslateService,Operacion],
    directives: [OperacionSave,Filter,OperacionPrint],
    pipes: [TranslatePipe]
})
export class OperacionPendiente extends ModelBase implements OnInit {

    public dataSelect:any = {};
    public typeView=2;
    public baseWeight=1;

    constructor(public router:Router, public http:Http, public toastr:ToastsManager, public myglobal:globalService, public translate:TranslateService,public operacion:Operacion) {
        super('PEND', '/pendings/', http, toastr, myglobal, translate);
    }
    ngOnInit(){
        this.operacion.initModel();

        this.baseWeight = parseFloat(this.myglobal.getParams('BASE_WEIGHT_INDICADOR') || '1');
        this.baseWeight = this.baseWeight >0?this.baseWeight:1;
        
        this.initModel();

        this.where="&where="+encodeURI("[['op':'eq','field':'enabled','value':true]]");
        this.loadData();
    }

    public list='pendings';
    loadDataPendings(event,data){
        event.preventDefault();
        this.list=data;
        if(this.list=='pendings')
            this.where="&where="+encodeURI("[['op':'eq','field':'enabled','value':true]]");
        else if(this.list=='asign')
            this.where="&where="+encodeURI("[['op':'eq','field':'enabled','value':false]]");
        else if(this.list=='all')
            this.where="";

        this.loadData();
    }

    initOptions() {
        this.max=10;
        this.viewOptions["title"] = 'Operaciones pendientes';
        this.viewOptions["buttons"].push({
            'visible': this.permissions.filter,
            'title': 'Filtrar',
            'class': 'btn btn-blue',
            'icon': 'fa fa-filter',
            'modal': this.paramsFilter.idModal
        });

        this.viewOptions.actions.delete = {
            'title': 'Eliminar',
            'visible': this.permissions.delete,
            'message': 'Estás seguro que deseas eliminar la operación pendiente del ',
            'keyAction': 'id'
        };
        this.viewOptions.actions.load = {
            'visible': this.permissions.add,
            'modalId':'cargaPendiente'
        };
        this.viewOptions.actions.verificar = {
            'visible': this.permissions.update,
        };
        this.viewOptions.actions.devolver = {
            'visible': this.permissions.lock,
        };
        this.viewOptions.actions.print = {
            'visible': this.permissions.print,
        };

    }

    initRules() {
        this.rules['vehicle']= {
            'type': 'text',
                'key': 'vehicle',
                'paramsSearch': {
                'label': {'title': "Empresa: ", 'detail': "Placa: "},
                'endpoint': "/search/vehicles/",
                    'where': '',
                    'imageGuest': '/assets/img/truck-guest.png',
                    'field': 'vehicle.id',
            },
            'search': true,
            'icon': 'fa fa-truck',
                'object': true,
                'title': 'Vehículo',
                'placeholder': 'Ingrese la placa del vehículo',
                'permissions': '69',
                'msg': {
                'error': 'El vehículo contiene errores',
                    'notAuthorized': 'No tiene permisos de listar los vehículos',
            },
        },
        this.rules['tagRFID']={
            'type': 'text',
            'search': true,
            'key': 'tagRFID',
            'icon': 'fa fa-balance-scale',
            'title': 'TagRFID',
            'placeholder': 'Ingrese tag RFID',
        }
        this.rules['weightIn']={
            'type': 'number',
            'step':'0.001',
            'search': true,
            'double':true,
            'key': 'weightIn',
            'icon': 'fa fa-balance-scale',
            'title': 'Peso E.',
            'placeholder': 'Ingrese el peso de entrada',
        }
        this.rules['weightOut']={
            'type': 'number',
            'step':'0.001',
            'search': true,
            'double':true,
            'key': 'weightOut',
            'icon': 'fa fa-balance-scale',
            'title': 'Peso S.',
            'placeholder': 'Ingrese el peso de salida',
        }
        this.rules['dateIn']={
            'type': 'date',
            'search': true,
            'title': 'Fecha de entrada.',
        }
        this.rules['dateOut']={
            'type': 'date',
            'search': true,
            'title': 'Fecha de salida',
        }

    }

    initSearch() {
    }

    initRuleObject() {
    }

    initFilter() {
        this.paramsFilter.title="Filtrar operaciones pendientes"
    }

    initPermissions() {
        this.permissions['print'] = this.myglobal.existsPermission(this.prefix + '_PRINT');
    }

    goTaquilla(event, companyId:string) {
        event.preventDefault();
        let link = ['TaquillaSearh', {search: companyId}];
        this.router.navigate(link);
    }
    @ViewChild(OperacionSave)
    operacionSave:OperacionSave;

    dataOperation:any={};
    cargarData(event,data){
        event.preventDefault();
        this.dataOperation=data;
        if(this.operacionSave) {
            this.operacionSave.pending=data.id;
            this.operacionSave.inAntena(data);
        }
    }
    formatDate(date, format) {
        if (date)
            return moment(date).format(format);
        return "-";
    }
    liberar(data) {
        this.dataOperation.operationId=data.id
        this.dataOperation.enabled=false;
        
        
    }
    loadWhere2(data){
        this.list='';
        this.loadWhere(data);
    }
    @ViewChild(OperacionPrint)
    operacionPrint:OperacionPrint;
    onPrintOperation(data){
        let successCallback= response => {
            if(this.operacionPrint)
                this.operacionPrint.data=response.json();
        };
        this.httputils.doGet('/operations/'+data.operationId,successCallback,this.error)
    }
}
