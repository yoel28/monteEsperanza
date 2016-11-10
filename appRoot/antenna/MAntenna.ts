import {globalService} from "../common/globalService";
import {ModelBase} from "../common/modelBase";

export class MAntenna extends ModelBase{
    public rules={};
    constructor(public myglobal:globalService){
        super('ANT','/antennas/',myglobal);
        this.initModel();
    }
    modelExternal() {}
    initRules(){

        this.rules['reference']={
            'type': 'text',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'reference',
            'title': 'Referencia',
            'placeholder': 'Referencia',
        };
        this.rules['way']={
            'type': 'select',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'source': [
                {'value': 'entrada', 'text': 'entrada'},
                {'value': 'salida', 'text': 'salida'},
            ],
            'key': 'way',
            'title': 'Dirección',
            'placeholder': 'Selecccione un la dirección',
        };
        this.rules = Object.assign({},this.rules,this.getRulesDefault())
    }
    initPermissions() {}
    initParamsSearch() {
        this.paramsSearch.title="Buscar antena";
        this.paramsSearch.placeholder="Ingrese antena";
        this.paramsSearch.label.title="Referencia: ";
        this.paramsSearch.label.detail="Dirección: "
    }
    initParamsSave() {
        this.paramsSave.title="Agregar antena"
    }
    initRuleObject() {
        this.ruleObject.title="Antenas";
        this.ruleObject.placeholder="Ingrese antena";
        this.ruleObject.key="antena";
        this.ruleObject.keyDisplay="antenaReference";
        this.ruleObject.code="antenaId";
    }
    initRulesSave() {
        this.rulesSave = Object.assign({},this.rules);
        delete this.rulesSave.enabled;
    }

}