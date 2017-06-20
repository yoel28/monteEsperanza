import {globalService} from "../common/globalService";
import {ModelBase} from "../common/modelBase";

export class MRuta extends ModelBase{

    constructor(public myglobal:globalService){
        super('ROUTE','/routes/',myglobal);
        this.initModel();
    }
    modelExternal() {}
    initRules(){
        this.rules['title']={
            'type': 'text',
            'icon':'fa fa-font',
            'required':true,
            'maxLength':'35',
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'title',
            'title': 'Título',
            'placeholder': 'Título',
        };
        this.rules['reference']={
            'type': 'text',
            'icon':'fa fa-font',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'reference',
            'title': 'Referencia',
            'placeholder': 'Referencia',
        };

        this.mergeRules();

    }
    initPermissions() {}
    initParamsSearch() {
        this.paramsSearch.title="Buscar ruta";
        this.paramsSearch.placeholder="Ingrese ruta";
        this.paramsSearch.label.title="Nombre: ";
        this.paramsSearch.label.detail="Código: ";
    }
    initParamsSave() {
        this.paramsSave.title="Agregar ruta"
    }
    initRuleObject() {
        this.ruleObject.title="Ruta";
        this.ruleObject.placeholder="Ingrese ruta";
        this.ruleObject.key="route";
        this.ruleObject.keyDisplay="routeReference";
        this.ruleObject.code="routeId";
    }
    initRulesSave() {
        this.rulesSave = Object.assign({},this.rules);
        this.rulesSave['detail'].required=true;
        delete this.rulesSave.enabled;
    }

}
