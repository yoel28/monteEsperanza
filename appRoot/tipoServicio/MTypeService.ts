import {globalService} from "../common/globalService";
import {ModelBase} from "../common/modelBase";

export class MTypeService extends ModelBase{
    public rules={};
    constructor(public myglobal:globalService){
        super('TSERV','/type/services/',myglobal);
        this.initModel();
    }
    modelExternal() {}
    initRules(){

        this.rules['title']={
            'type': 'text',
            'required':true,
            'icon':'fa fa-key',
            'maxLength':'35',
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'title',
            'title': 'Título',
            'placeholder': 'Título',
        };
        this.rules['code']={
            'type': 'text',
            'required':true,
            'icon':'fa fa-key',
            'maxLength':'35',
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'code',
            'title': 'Código',
            'placeholder': 'Código',
        };
        this.rules['price']={
            'type': 'number',
            'step':'0.01',
            'double':true,
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'price',
            'title': 'Precio',
            'placeholder': 'Precio',
        };

        this.rules = Object.assign({},this.rules,this.getRulesDefault())
    }
    initPermissions() {}
    initParamsSearch() {
        this.paramsSearch.title="Buscar tipo de servicio";
        this.paramsSearch.placeholder="Ingrese el tipo de servicio";
        this.paramsSearch.label.title="Tipo: ";
        this.paramsSearch.label.detail="Código: ";
    }
    initParamsSave() {
        this.paramsSave.title="Agregar tipo de servicio"
    }
    initRuleObject() {
        this.ruleObject.title="Tipo de servicio";
        this.ruleObject.placeholder="Ingrese el tipo de servicio";
        this.ruleObject.key="serviceType";
        this.ruleObject.keyDisplay="serviceTypeCode";
        this.ruleObject.code="serviceTypeId";
    }
    initRulesSave() {
        this.rulesSave = Object.assign({},this.rules);
        delete this.rulesSave.enabled;
    }

}