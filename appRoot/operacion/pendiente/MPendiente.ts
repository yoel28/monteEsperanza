import {globalService} from "../../common/globalService";
import {ModelBase} from "../../common/modelBase";
import {MVehicle} from "../../vehiculo/MVehicle";

export class MPendiente extends ModelBase{
    public rules={};

    public vehicle:any;
    constructor(public myglobal:globalService){
        super('PEND','/pendings/',myglobal);
        this.initModel();
    }
    modelExternal() {
        this.vehicle = new MVehicle(this.myglobal);
    }
    initRules(){

        this.rules['vehicle']= this.vehicle.ruleObject;

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
            'title': 'Lote E.',
            'placeholder': 'Lote de entrada',
        }
        this.rules['lotValOut']={
            'type': 'number',
            'step':'0',
            'search': this.permissions.filter,
            'key': 'lotValOut',
            'icon': 'fa fa-clock-o',
            'title': 'Lote S.',
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
    initPermissions() {
        this.permissions['print'] = this.myglobal.existsPermission(this.prefix + '_PRINT');
    }
    initParamsSearch() {
        this.paramsSearch.title="Buscar pendiente";
        this.paramsSearch.placeholder="Ingrese pendiente";
    }
    initParamsSave() {

    }
    initRuleObject() {
        this.ruleObject.title="Pendiente";
        this.ruleObject.placeholder="Ingrese pendiente";
        this.ruleObject.key="pending";
    }
    initRulesSave() {}

}