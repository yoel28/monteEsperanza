import {globalService} from "../common/globalService";
import {ModelBase} from "../common/modelBase";

export class MTypeVehicle extends ModelBase{
    public rules={};
    constructor(public myglobal:globalService){
        super('TYPE_VEH','/type/vehicles/',myglobal);
        this.initModel();
    }
    modelExternal() {}
    initRules(){

        this.rules['title'] = {
                'type': 'text',
                'icon': 'fa fa-font',
                'required': true,
                'maxLength': '50',
                'update': this.permissions.update,
                'search': this.permissions.filter,
                'visible': this.permissions.visible,
                'key': 'title',
                'title': 'Título',
                'placeholder': 'Título',
            };

        this.rules['icon']={
            'type': 'select',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'source':[
                {'value': 'fa fa-truck', 'text': 'truck'},
                {'value': 'fa fa-car', 'text': 'car'},
                {'value': 'fa fa-bus', 'text': 'bus'},
                {'value': 'fa fa-taxi', 'text': 'taxi'},
            ],
            'key': 'icon',
            'title': 'Icono',
            'placeholder': 'Seleccione un icono',
        };

        this.rules = Object.assign({},this.rules,this.getRulesDefault());
        this.rules['detail'].required=true;
    }
    initPermissions() {}
    initParamsSearch() {
        this.paramsSearch.title="Buscar tipo de vehículo";
        this.paramsSearch.placeholder="Ingrese el tipo de vehículo";
    }
    initParamsSave() {
        this.paramsSave.title="Agregar tipo de vehículo"
    }
    initRuleObject() {
        this.ruleObject.title="Tipo de vehículo";
        this.ruleObject.placeholder="Ingrese  el tipo de vehículo";
        this.ruleObject.key="vehicleType";
        this.ruleObject.keyDisplay="vehicleTypeTitle";
        this.ruleObject.code="vehicleTypeId";
    }
    initRulesSave() {
        this.rulesSave = Object.assign({},this.rules);
        delete this.rulesSave.enabled;
    }

}

