import {Component, OnInit,ViewChild} from '@angular/core';
import {Router}           from '@angular/router-deprecated';
import {Http} from '@angular/http';
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {globalService} from "../../common/globalService";
import {ModelBase} from "../../common/modelBase";
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";
import {Operacion} from "../operacion";
import {OperacionSave} from "../methods";
import moment from "moment/moment";
import {Filter} from "../../utils/filter/filter";


@Component({
    selector: 'operacion-pendiente',
    templateUrl: 'app/operacion/pendiente/index.html',
    styleUrls: ['app/operacion/pendiente/style.css'],
    providers: [TranslateService,Operacion],
    directives: [OperacionSave,Filter],
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
        this.loadData();
    }

    initOptions() {
        this.max=20;
        this.viewOptions["title"] = 'Operaciones pendientes';
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
            'message': 'Estás seguro que deseas eliminar la operación pendiente del ',
            'keyAction': 'id'
        };
        this.viewOptions.actions.load = {
            'visible': this.permissions.add,
            'modalId':'cargaPendiente'
        };


    }

    initRules() {
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
    }

    initSearch() {
    }

    initRuleObject() {
    }

    initFilter() {
        this.paramsFilter.title="Filtrar operaciones pendientes"
    }

    initPermissions() {
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
            this.operacionSave.pendients=true;
            this.operacionSave.inAntena(data);
        }
    }
    formatDate(date, format) {
        if (date)
            return moment(date).format(format);
        return "-";
    }
    liberar(data) {
        this.onDelete(null,this.dataOperation.id);
    }
    getBaseWeight(weight){
        if(typeof weight === "number")
            return weight/this.baseWeight;
    }
}
