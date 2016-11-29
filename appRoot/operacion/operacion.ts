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
import {NgSwitch, NgSwitchWhen, Control, Validators} from "@angular/common";
import {ControllerBase} from "../common/ControllerBase";
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";
import {MOperacion} from "./MOperacion";
import {Tooltip} from "../utils/tooltips/tooltips";

declare var SystemJS:any;

@Component({
    selector: 'operacion',
    templateUrl: SystemJS.map.app+'/operacion/index.html',
    styleUrls: [SystemJS.map.app+'/operacion/style.css'],
    providers: [TranslateService],
    directives: [OperacionSave, Xeditable, Filter, OperacionPrint, NgSwitch, NgSwitchWhen,Tooltip],
    pipes: [TranslatePipe]
})
export class Operacion extends ControllerBase implements OnInit {
    
    public dataSelect:any = {};
    public MONEY_METRIC_SHORT:string = "";
    public AUTOMATIC_RECHARGE_PREF="";
    public commentDelete:Control;

    constructor(public router:Router, public http:Http, public toastr:ToastsManager, public myglobal:globalService, public translate:TranslateService) {
        super('OP', '/operations/',router, http, toastr, myglobal, translate);
    }

    ngOnInit() {
        this.initModel();
        this.initViewOptions();

        this.MONEY_METRIC_SHORT = this.myglobal.getParams('MONEY_METRIC_SHORT');
        this.AUTOMATIC_RECHARGE_PREF = this.myglobal.getParams('AUTOMATIC_RECHARGE_PREF');
        this.commentDelete = new Control(null,Validators.required);

        if (this.model.permissions['list']) {

            let start = moment().startOf('month').format('DD-MM-YYYY');
            let end = moment().endOf('month').add('1','day').format('DD-MM-YYYY');

            this.where="&where="+encodeURI("[['op':'ge','field':'dateCreated','value':'"+start+"','type':'date'],['op':'le','field':'dateCreated','value':'"+end+"','type':'date']]");
            if (localStorage.getItem('view11'))
                this.view = JSON.parse(localStorage.getItem('view11'));
            this.ordenView();
            this.loadData();
        }
    }
    initModel() {
        this.model= new MOperacion(this.myglobal);

    }
    onPatchDelete(event = null, id) {
        if (event)
            event.preventDefault();

        let body={};
        let that= this;
        body['comment']=this.commentDelete.value+'-----------------'+(this.dataSelect.comment || '');

        let successCallback= response => {
            Object.assign(that.dataSelect, response.json());
            this.httputils.onDelete(this.endpoint + id, id, this.dataList.list, this.error);
        }
        this.httputils.doPut(this.endpoint+id,JSON.stringify(body),successCallback,this.error);
    }
    loadViewDelete(event){
        if(event)
            event.preventDefault();
        this.viewDelete=!this.viewDelete;
        this.loadData();

    }


    initViewOptions() {
        this.viewOptions["title"] = 'Operaciones';
        this.viewOptions["buttons"] = [];
        this.viewOptions["actions"] = {};

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


        this.viewOptions.actions.delete = {
            'title': 'Eliminar',
            'visible': this.model.permissions.delete,
            'message': 'Estás seguro que deseas eliminar la operación con del vehículo ',
            'keyAction': 'vehiclePlate'
        };

        this.viewOptions.actions.print = {
            'visible': this.model.permissions.print,
        };

        this.viewOptions.actions.automatic = {
            'visible': this.model.permissions.automatic,
        };


        if(this.model.permissions.update){
            this.viewOptions.actions.edit = {
                'visible': this.model.permissions.update,
                'title':'editar',
                'modal':this.myglobal.objectInstance['OP'].idModal,
            };
        }
        this.viewOptions.actions.close = {
            'visible': this.model.permissions.update && this.model.permissions.close,
            'title':'Finalizar operación',
        };


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
    onKeyComment(event:any) {
        this.commentDelete.updateValue(event.target.value);
    }
    

    public view = [
        {'visible': true, 'position': 1, 'title': 'Fecha de salida', 'key': 'rechargeReferenceDate'},
        {'visible': true, 'position': 2, 'title': 'Recibo', 'key': 'rechargeReference'},
        {'visible': true, 'position': 3, 'title': 'Monto', 'key': 'rechargeQuantity'},
        {'visible': true, 'position': 4, 'title': 'Vehiculo', 'key': 'vehicle'},
        {'visible': true, 'position': 5, 'title': 'Peso de entrada', 'key': 'weightIn'},
        {'visible': true, 'position': 6, 'title': 'Peso de salida', 'key': 'weightOut'},
        {'visible': true, 'position': 7, 'title': 'Descargado', 'key': 'neto'},


        {'visible': false, 'position': 8, 'title': 'Cliente', 'key': 'company'},
        {'visible': false, 'position': 9, 'title': 'Grupo', 'key': 'companyTypeName'},
        {'visible': false, 'position': 10, 'title': 'Ruta', 'key': 'route'},
        {'visible': false, 'position': 11, 'title': 'Tipo de basura', 'key': 'trash'},
        {'visible': false, 'position': 12, 'title': 'Operador', 'key': 'usernameCreator'},
        {'visible': false, 'position': 13, 'title': 'Fecha de Entrada', 'key': 'dateCreated'},
        {'visible': true, 'position': 14, 'title': 'Chofer', 'key': 'choferName'},
        {'visible': true, 'position': 15, 'title': 'Contenedor', 'key': 'containerCode'},
        {'visible': true, 'position': 16, 'title': 'Comentario', 'key': 'comment'},
        {'visible': true, 'position': 17, 'title': 'Habilitado', 'key': 'enabled'},

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
        localStorage.setItem('view11', JSON.stringify(this.view))
    }

    setVisibleView(data) {
        this.view.forEach(key=> {
            if (key.key == data.key) {
                key.visible = !key.visible;
                return;
            }
        })
        localStorage.setItem('view11', JSON.stringify(this.view))
    }

    edit(data){
        if (this.myglobal.objectInstance['OP']) {
            //this.dataSelect = ;
            this.myglobal.objectInstance['OP'].loadEdit(data);
        }
    }
    
}

@Component({
    selector: 'operacion-monitor',
    templateUrl: SystemJS.map.app+'/operacion/monitor.html',
    styleUrls: [SystemJS.map.app+'/operacion/style.css'],
    directives:[Tooltip],
    pipes: [Fecha]
})
export class OperacionMonitor extends RestController implements OnInit {

    constructor(public router:Router, public http:Http, public toastr:ToastsManager, public myglobal:globalService) {
        super(http, toastr);
        this.setEndpoint('/operations/');
    }

    ngOnInit() {
        this.where = "&where="+encodeURI("[['op':'isNull','field':'weightOut']]")
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

