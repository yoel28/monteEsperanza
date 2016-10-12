import {Component, OnInit,ViewChild} from '@angular/core';
import {Router}           from '@angular/router-deprecated';
import {Http} from '@angular/http';
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {globalService} from "../../common/globalService";
import {ControllerBase} from "../../common/ControllerBase";
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";
import {Operacion} from "../operacion";
import {OperacionSave, OperacionPrint} from "../methods";
import moment from "moment/moment";
import {Filter} from "../../utils/filter/filter";
declare var SystemJS:any;

@Component({
    selector: 'operacion-pendiente',
    templateUrl: SystemJS.map.app+'/operacion/pendiente/index.html',
    styleUrls: [SystemJS.map.app+'/operacion/pendiente/style.css'],
    providers: [TranslateService,Operacion],
    directives: [OperacionSave,Filter,OperacionPrint],
    pipes: [TranslatePipe]
})
export class OperacionPendiente extends ControllerBase implements OnInit {

    public dataSelect:any = {};
    public typeView=2;
    public baseWeight=1;

    constructor(public router:Router, public http:Http, public toastr:ToastsManager, public myglobal:globalService, public translate:TranslateService,public operacion:Operacion) {
        super('PEND', '/pendings/',router, http, toastr, myglobal, translate);
    }
    ngOnInit(){
        this.operacion.initModel();

        this.baseWeight = parseFloat(this.myglobal.getParams('BASE_WEIGHT_INDICADOR') || '1');
        this.baseWeight = this.baseWeight >0?this.baseWeight:1;
        
        this.initModel();

        this.where="&where="+encodeURI("[['op':'eq','field':'enabled','value':true],['op':'eq','field':'expired','value':false],['op':'isNotNull','field':'dateIn'],['op':'isNotNull','field':'vehicle']]");
        this.loadData();
    }

    public list='pendings';
    loadDataPendings(event,data){
        if(event)
            event.preventDefault();
        this.list=data;
        switch (this.list)
        {
            case 'pendings' :
                this.where="&where="+encodeURI("[['op':'eq','field':'enabled','value':true],['op':'eq','field':'expired','value':false],['op':'isNotNull','field':'dateIn'],['op':'isNotNull','field':'vehicle']]");
                break;
            case 'pendingsAll' :
                this.where="&where="+encodeURI("[['op':'eq','field':'enabled','value':true]]");
                break;
            case 'asign' :
                this.where="&where="+encodeURI("[['op':'eq','field':'enabled','value':false]]");
                break;
            case 'all' :
                this.where="";
                break;
            case 'expired' :
                this.where="&where="+encodeURI("[['op':'eq','field':'expired','value':true]]");
                break;
            default :
                this.where="";
        }
        this.loadData();
    }

    initViewOptions() {
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
        this.viewOptions.actions.rechazar = {
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
            'search': this.permissions.filter,
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
            'search': this.permissions.filter,
            'key': 'tagRFID',
            'icon': 'fa fa-balance-scale',
            'title': 'TagRFID',
            'placeholder': 'Ingrese tag RFID',
        }
        this.rules['timeBalIn']={
            'type': 'number',
            'step':'0',
            'search': this.permissions.filter,
            'key': 'timeBalIn',
            'icon': 'fa fa-clock-o',
            'title': 'Tiempo E.',
            'placeholder': 'Tiempo en la balanza de entrada',
        }
        this.rules['timeBalOut']={
            'type': 'number',
            'step':'0',
            'search': this.permissions.filter,
            'key': 'timeBalOut',
            'icon': 'fa fa-clock-o',
            'title': 'Tiempo S.',
            'placeholder': 'Tiempo en la balanza de salida',
        }
        this.rules['lotValIn']={
            'type': 'number',
            'step':'0',
            'search': this.permissions.filter,
            'key': 'lotValIn',
            'icon': 'fa fa-clock-o',
            'title': 'Tiempo E.',
            'placeholder': 'Lote de entrada',
        }
        this.rules['lotValOut']={
            'type': 'number',
            'step':'0',
            'search': this.permissions.filter,
            'key': 'lotValOut',
            'icon': 'fa fa-clock-o',
            'title': 'Tiempo E.',
            'placeholder': 'Lote de salida',
        }
        this.rules['weightIn']={
            'type': 'number',
            'step':'0.001',
            'search': this.permissions.filter,
            'double':true,
            'key': 'weightIn',
            'icon': 'fa fa-balance-scale',
            'title': 'Peso E.',
            'placeholder': 'Ingrese el peso de entrada',
        }
        this.rules['weightOut']={
            'type': 'number',
            'step':'0.001',
            'search': this.permissions.filter,
            'double':true,
            'key': 'weightOut',
            'icon': 'fa fa-balance-scale',
            'title': 'Peso S.',
            'placeholder': 'Ingrese el peso de salida',
        }
        this.rules['dateIn']={
            'type': 'date',
            'search': this.permissions.filter,
            'title': 'Fecha de entrada.',
        }
        this.rules['dateOut']={
            'type': 'date',
            'search': this.permissions.filter,
            'title': 'Fecha de salida',
        }

    }
    initRulesSave() {}
    initParamsSearch() {}
    initRuleObject() {}
    initParamsFilter() {
        this.paramsFilter.title="Filtrar operaciones pendientes"
    }
    initPermissions() {
        this.permissions['print'] = this.myglobal.existsPermission(this.prefix + '_PRINT');
    }
    initRulesAudit() {}
    initParamsSave() {}

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
    onPrintOperation(event,data){
        if(event)
            event.preventDefault();
        let successCallback= response => {
            if(this.operacionPrint)
                this.operacionPrint.data=response.json();
        };
        this.httputils.doGet('/operations/'+data.operationId,successCallback,this.error)
    }
}
