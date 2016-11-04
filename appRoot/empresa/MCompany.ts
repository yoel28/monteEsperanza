import {globalService} from "../common/globalService";
import {ModelBase} from "../common/modelBase";
import {MTypeCompany} from "../tipoEmpresa/MTypeCompany";

export class MCompany extends ModelBase{

    public rules={};
    public typeCompany:any;

    constructor(public myglobal:globalService){
        super('COMPANY','/companies/',myglobal);
        this.initModel();
    }
    modelExternal() {
        this.typeCompany = new MTypeCompany(this.myglobal);
    }
    initRules(){

        this.rules['image']={
            'type': 'image',
            'update':this.permissions.update,
            'visible':this.permissions.visible,
            'key': 'image',
            'title': 'Imagen',
            'placeholder': 'Imagen',
        };
        this.rules['name']={
            'type': 'text',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'name',
            'title': 'Nombre',
            'placeholder': 'Nombre',
        };
        this.rules['ruc']={
            'type': 'text',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'ruc',
            'title': 'RUC',
            'placeholder': 'RUC',
        };
        this.rules['code']={
            'type': 'text',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'code',
            'title': 'Codigo',
            'placeholder': 'Código',
        };
        this.rules['responsiblePerson']={
            'type': 'text',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'responsiblePerson',
            'title': 'Responsable',
            'placeholder': 'Responsable',
        };
        this.rules['phone']={
            'type': 'text',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'phone',
            'title': 'Teléfono',
            'placeholder': 'Teléfono',
        };
        this.rules['minBalance']={
            'type': 'number',
            'required':true,
            'double':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'minBalance',
            'title': 'Balance mínimo',
            'placeholder': 'Balance mínimo',
        };
        this.rules['balance']={
            'type': 'number',
            'required':true,
            'double':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'balance',
            'title': 'Balance',
            'placeholder': 'Balance',
        };
        this.rules['address']={
            'type': 'text',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'address',
            'icon': 'fa fa-list',
            'title': 'Dirección',
            'placeholder': 'Dirección',
        };
        this.rules['debt']={
            'type': 'number',
            'step':'0.001',
            'required':true,
            'double':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'debt',
            'title': 'Deuda (Valores negativos)',
            'placeholder': 'Deuda',
        };
        this.rules['companyType'] = this.typeCompany.ruleObject;
        this.rules['companyType'].required = true;


        this.rules = Object.assign({},this.rules,this.getRulesDefault())
    }
    initPermissions() {}
    initParamsSearch() {
        this.paramsSearch.title="Buscar  compañia";
        this.paramsSearch.placeholder="Ingrese codigo de compañia";
    }
    initParamsSave() {
        this.paramsSave.title="Agregar compañia"
    }
    initRuleObject() {
        this.ruleObject.title="Compañia";
        this.ruleObject.placeholder="Ingrese compañia";
        this.ruleObject.key="company";
    }
    initRulesSave() {
        this.rulesSave = Object.assign({},this.rules);
        delete this.rulesSave.enabled;
        delete this.rulesSave.balance;
        delete this.rulesSave.debt;
        delete this.rulesSave.detail;
    }

}