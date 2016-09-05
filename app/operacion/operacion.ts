import {Component, ViewChild, OnInit, Injectable} from '@angular/core';
import {Router}           from '@angular/router-deprecated';
import {Http} from '@angular/http';
import {RestController} from "../common/restController";
import  {OperacionSave, OperacionPrint} from "./methods";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {Xeditable} from "../common/xeditable";
import {globalService} from "../common/globalService";
import {Filter} from "../utils/filter/filter";
import {Fecha} from "../utils/pipe";
import moment from "moment/moment";
import {NgSwitch, NgSwitchWhen} from "@angular/common";
import {ModelBase} from "../common/modelBase";
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";
import {stringify} from "querystring";


@Component({
    selector: 'operacion',
    templateUrl: 'app/operacion/index.html',
    styleUrls: ['app/operacion/style.css'],
    providers: [TranslateService],
    directives: [OperacionSave, Xeditable, Filter, OperacionPrint, NgSwitch, NgSwitchWhen],
    pipes: [TranslatePipe]
})
export class Operacion extends ModelBase implements OnInit {
    public dataSelect:any = {};
    public MONEY_METRIC_SHORT:string = "";
    public AUTOMATIC_RECHARGE_PREF="";

    constructor(public router:Router, public http:Http, public toastr:ToastsManager, public myglobal:globalService, public translate:TranslateService) {
        super('OP', '/operations/', http, toastr, myglobal, translate);
    }

    ngOnInit() {
        this.initModel();
        this.MONEY_METRIC_SHORT = this.myglobal.getParams('MONEY_METRIC_SHORT');
        this.AUTOMATIC_RECHARGE_PREF = this.myglobal.getParams('AUTOMATIC_RECHARGE_PREF')

        if (this.permissions['list']) {
            this.max = 40;
            if (localStorage.getItem('view4'))
                this.view = JSON.parse(localStorage.getItem('view4'));
            this.ordenView();
            this.loadData();
        }
    }

    initOptions() {
        this.viewOptions["title"] = 'Operaciones';
        this.viewOptions["buttons"].push({
            'visible': this.permissions['add'],
            'title': 'Agregar',
            'class': 'btn btn-primary',
            'icon': 'fa fa-plus',
            'modal': this.paramsSave.idModal
        });
        this.viewOptions["buttons"].push({
            'visible': this.permissions['filter'],
            'title': 'Filtrar',
            'class': 'btn btn-blue',
            'icon': 'fa fa-filter',
            'modal': this.paramsFilter.idModal
        });

        this.viewOptions.actions.delete = {
            'title': 'Eliminar',
            'visible': this.permissions.delete,
            'message': 'Estás seguro que deseas eliminar la operación con el recibo ',
            'keyAction': 'rechargeReference'
        };

        this.viewOptions.actions.print = {
            'visible': this.permissions.print,
        };

        this.viewOptions.actions.automatic = {
            'visible': this.permissions.automatic,
        };


    }

    initRules() {
        let modelRules = {
            'vehicle': {
                'type': 'text',
                'required': true,
                'readOnly': false,
                'key': 'vehicle',
                'paramsSearch': {
                    'label': {'title': "Empresa: ", 'detail': "Placa: "},
                    'endpoint': "/search/vehicles/",
                    'where': '',
                    'imageGuest': '/assets/img/truck-guest.png',
                    'field': 'vehicle.id',
                },
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
            'company': {
                'type': 'text',
                'required': true,
                'key': 'company',
                'readOnly': false,
                'checkBalance': true,
                'checkBalancePermission': this.myglobal.existsPermission('160'),
                'paramsSearch': {
                    'label': {'title': "Nombre: ", 'detail': "Codigo: "},
                    'endpoint': "/search/companies/",
                    'where': '',
                    'imageGuest': '/assets/img/company-guest.png',
                    'field': 'company.id',
                },
                'icon': 'fa fa-building',
                'object': true,
                'title': 'Cliente',
                'placeholder': 'Ingrese el Codigo/RUC del cliente',
                'permissions': '80',
                'msg': {
                    'error': 'El cliente contiene errores',
                    'notAuthorized': 'No tiene permisos de listar los clientes',
                    'errorCheckBalance': "El cliente no tiene saldo suficiente"
                },
            },
            'trashType': {
                'type': 'text',
                'required': true,
                'key': 'trashType',
                'readOnly': false,
                'permissions': '136',
                'paramsSearch': {
                    'label': {'title': "Tipo: ", 'detail': "Referencia: "},
                    'endpoint': "/search/type/trash/",
                    'where': '',
                    'imageGuest': '/assets/img/trash-guest.png',
                    'field': 'trashType',
                },
                'icon': 'fa fa-trash',
                'object': true,
                'title': 'Basura',
                'placeholder': 'Referencia del tipo de basura',
                'msg': {
                    'error': 'El tipo de basura contiene errores',
                    'notAuthorized': 'No tiene permisos de listar los tipos de basura',
                },
            },
            'route': {
                'type': 'text',
                'required': true,
                'key': 'route',
                'readOnly': false,
                'paramsSearch': {
                    'label': {'title': "Ruta: ", 'detail': "Referencia: "},
                    'endpoint': "/search/routes/",
                    'where': '',
                    'imageGuest': '/assets/img/truck-guest.png',
                    'field': 'route.id',
                },
                'icon': 'fa fa-random',
                'object': true,
                'title': 'Ruta',
                'placeholder': 'Referencia de la ruta',
                'permissions': '69',
                'msg': {
                    'error': 'La ruta contiene errores',
                    'notAuthorized': 'No tiene permisos de listar las rutas',
                },
            },

            'weightIn': {
                'type': 'number',
                'display': null,
                'required': true,
                'mode': 'inline',
                'double': true,
                'search': true,
                'key': 'weightIn',
                'readOnly': false,
                'icon': 'fa fa-balance-scale',
                'title': 'Peso E.',
                'placeholder': 'Ingrese el peso de entrada',
                'msg': {
                    'error': 'El peso debe ser numerico',
                },
                'refreshField':{
                    'icon':'fa fa-refresh',
                    'endpoint':'/weight/',
                    'field':'weight',
                }
            },
            'weightOut': {
                'type': 'number',
                'display': null,
                'mode': 'inline',
                'search': true,
                'key': 'weightOut',
                'readOnly': false,
                'hidden': true,
                'double': true,
                'icon': 'fa fa-balance-scale',
                'title': 'Peso S.',
                'placeholder': 'Peso de salida',
                'msg': {
                    'error': 'El peso debe ser numerico',
                },
                'refreshField':{
                    'icon':'fa fa-refresh',
                    'endpoint':'/weight/',
                    'field':'weight',
                }
            },
            'comment': {
                'type': 'textarea',
                'key': 'description',
                'icon': 'fa fa-font',
                'title': 'Comentarios',
                'placeholder': 'Ingrese un comentario',
                'msg': {
                    'error': 'El comentario contiene errores',
                },
            },
        }
        Object.assign(this.rulesSave, modelRules);
        Object.assign(this.rules, modelRules, this.rules);
    }

    initPermissions() {
        this.permissions['print'] = this.myglobal.existsPermission(this.prefix + '_PRINT');
        this.permissions['automatic'] = this.myglobal.existsPermission(this.prefix + '_AUTOMATIC');
    }

    initSearch() {
    }

    initRuleObject() {
        this.ruleObject.key = "operation";
        this.ruleObject.title = "Operaciones";
        this.ruleObject.placeholder = "Ingrese el codigo de la operacion";

    }

    initFilter() {
        this.paramsFilter.title = "Filtrar operaciones";
    }


    @ViewChild(OperacionPrint)
    operacionPrint:OperacionPrint;

    public onPrint(data) {
        if (this.operacionPrint)
            this.operacionPrint.data = data
    }

    public PrintAutomatic:string = "";

    onEditableWeight(field, data, value, endpoint):any {
        let cond = this.myglobal.getParams('PesoE>PesoS');
        let peso = parseFloat(value);
        let that = this;
        if (
            peso > 0.0 &&
            (
                (field == 'weightOut' && cond == "true" && data.weightIn >= peso) ||
                (field == 'weightIn' && cond == "true" && peso >= data.weightOut) ||
                (cond != "true")
            )
        ) {
            let json = {};
            json[field] = parseFloat(value);
            let body = JSON.stringify(json);
            let error = err => {
                that.toastr.error(err.json().message);
            };
            let successCallback = response => {
                Object.assign(data, response.json());
                if (that.toastr)
                    that.toastr.success('Actualizado con éxito', 'Notificación');
            }
            return this.httputils.doPut(endpoint + data.id, body, successCallback, error)
        }
    }

    goTaquilla(event, companyId:string) {
        event.preventDefault();
        let link = ['TaquillaSearh', {search: companyId}];
        this.router.navigate(link);
    }

    public codeReference="";
    onRechargeAutomatic(event, data) {
        let that = this;
        event.preventDefault();
        let json={};
        json['reference']=this.codeReference.length>0? this.codeReference: (this.AUTOMATIC_RECHARGE_PREF+data.rechargeReference);
        let successCallback = response => {
            Object.assign(data, response.json());
            if (that.toastr)
                that.toastr.success('Pago cargado con éxito', 'Notificación');

        }
        this.httputils.doPost('/pay/' + data.id,JSON.stringify(json),successCallback, this.error);
    }
    onKey(event:any) {
        this.codeReference = event.target.value;
    }

    formatDate(date, format) {
        if (date)
            return moment(date).format(format);
        return "-";
    }

    public view = [
        {'visible': true, 'position': 1, 'title': 'Fecha de transaccion', 'key': 'rechargeReferenceDate'},
        {'visible': true, 'position': 2, 'title': 'Recibo', 'key': 'rechargeReference'},
        {'visible': true, 'position': 3, 'title': 'Monto', 'key': 'rechargeQuantity'},
        {'visible': true, 'position': 4, 'title': 'Vehiculo', 'key': 'vehicle'},
        {'visible': true, 'position': 5, 'title': 'Peso de entrada', 'key': 'weightIn'},
        {'visible': true, 'position': 6, 'title': 'Peso de salida', 'key': 'weightOut'},
        {'visible': true, 'position': 7, 'title': 'Peso neto', 'key': 'neto'},


        {'visible': false, 'position': 8, 'title': 'Cliente', 'key': 'company'},
        {'visible': false, 'position': 9, 'title': 'Grupos', 'key': 'companyTypeName'},
        {'visible': false, 'position': 10, 'title': 'Rutas', 'key': 'route'},
        {'visible': false, 'position': 11, 'title': 'Tipo de basura', 'key': 'trash'},
        {'visible': false, 'position': 12, 'title': 'Operador', 'key': 'usernameCreator'},

    ];

    setOrden(data, dir) {
        if (dir == "asc") {
            let pos = data.position - 1;
            this.view.forEach(key=> {
                if (pos > 0) {
                    if (key.position == pos) {
                        key.position = pos + 1;
                    }
                    if (key.key == (data.key)) {
                        key.position = pos;
                    }
                }
            })
        }
        else {
            let pos = data.position + 1;
            this.view.forEach(key=> {
                if (pos < 12) {
                    if (key.position == pos) {
                        key.position = pos - 1;
                    }
                    if (key.key == (data.key)) {
                        key.position = pos;
                    }
                }
            })
        }
        this.ordenView();
    }

    public orderViewData = [];

    ordenView() {
        let that = this;
        that.orderViewData = [];
        for (let i = 1; i <= this.view.length; i++) {
            this.view.forEach(key=> {
                if (key['position'] == i) {
                    that.orderViewData.push(key);
                    return;
                }
            })
        }
        localStorage.setItem('view4', JSON.stringify(this.view))
    }

    setVisibleView(data) {
        this.view.forEach(key=> {
            if (key.key == data.key) {
                key.visible = !key.visible;
                return;
            }
        })
        localStorage.setItem('view4', JSON.stringify(this.view))
    }
}

@Component({
    selector: 'operacion-monitor',
    templateUrl: 'app/operacion/monitor.html',
    styleUrls: ['app/operacion/style.css'],
    pipes: [Fecha]
})
export class OperacionMonitor extends RestController implements OnInit {

    constructor(public router:Router, public http:Http, public toastr:ToastsManager, public myglobal:globalService) {
        super(http, toastr);
        this.setEndpoint('/operations/');
    }

    ngOnInit() {
        this.where = "&where=[['op':'isNull','field':'weightOut']]"
        if (this.myglobal.existsPermission('165')) {
            this.max = 15;
            this.loadData();
        }
    }

    goTaquilla(event, companyId:string) {
        event.preventDefault();
        let link = ['TaquillaSearh', {search: companyId}];
        this.router.navigate(link);
    }

}

