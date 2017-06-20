import {globalService} from "../common/globalService";
import {ModelBase} from "../common/modelBase";
import {MTypeService} from "../tipoServicio/MTypeService";

export class MService extends ModelBase{

    public tipoServicio;

    public MONEY_METRIC_SHORT:string="";
    
    constructor(public myglobal:globalService){
        super('SERV','/services/',myglobal);
        this.initParams();
        this.initModel();
    }
    initParams(){
        this.MONEY_METRIC_SHORT=this.myglobal.getParams('MONEY_METRIC_SHORT');
    }
    modelExternal() {
        this.tipoServicio = new MTypeService(this.myglobal);
    }
    initRules(){

        this.rules['plate']={
            'type': 'text',
            'icon':'fa fa-truck',
            'maxLength':'35',
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'plate',
            'title': 'Placa',
            'placeholder': 'Placa',
        };

        this.rules['ruc']={
            'type': 'text',
            'icon':'fa fa-key',
            'maxLength':'35',
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'ruc',
            'title': 'RUC',
            'placeholder': 'RUC',
        };

        this.rules['serviceType']=this.tipoServicio.ruleObject;
        this.rules['serviceType'].required=true;

        this.rules['amount']={
            'type': 'number',
            'step':'0.01',
            'double':true,
            'icon':'fa fa-money',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'amount',
            'title': 'Precio',
            'placeholder': 'Precio',
        };
        this.rules['weight']={
            'type': 'number',
            'step':'0.001',
            'double':true,
            'icon':'fa fa-balance-scale',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'weight',
            'title': 'Peso',
            'placeholder': 'Peso',
            'refreshField':{
                'icon':'fa fa-refresh',
                'endpoint':'/weight/',
                'field':'weight',
            }
        };

        this.mergeRules();
        
    }
    initPermissions() {}
    initParamsSearch() {
        this.paramsSearch.title="Buscar servicio";
        this.paramsSearch.placeholder="Ingrese el servicio";
    }
    initParamsSave() {
        this.paramsSave.title="Agregar servicio"
    }
    initRuleObject() {
        this.ruleObject.title="Servicio";
        this.ruleObject.placeholder="Ingrese el servicio";
        this.ruleObject.key="service";
    }
    initRulesSave() {
        this.rulesSave = Object.assign({},this.rules);
        delete this.rulesSave.enabled;
    }

}