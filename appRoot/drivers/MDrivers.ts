import {globalService} from "../common/globalService";
import {ModelBase} from "../common/modelBase";

export class MDrivers extends ModelBase{
    public rules={};
    constructor(public myglobal:globalService){
        super('CHOFER','/drivers/',myglobal);
        this.initModel();
    }
    initRules(){
        this.rules['name']={
            'type': 'text',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'name',
            'title': 'Nombre',
            'placeholder': 'Ingrese Nombre',
            'msg':{
                'error':'Este campo es obligatorio',
            }
        }
        this.rules['telefono']={
            'type': 'text',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'telefono',
            'title': 'Teléfono',
            'placeholder': 'Ingrese teléfono',
            'msg':{
                'error':'Este campo es obligatorio',
            }
        }
        this.rules['direccion']={
            'type': 'text',
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'direccion',
            'icon': 'fa fa-list',
            'title': 'Dirección',
            'placeholder': 'Ingrese Dirección',
            'msg':{
                'error':'Este campo es obligatorio',
            }
        }
        this.rules['email']={
            'type': 'text',
            'required':true,
            'email':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'email',
            'icon': 'fa fa-list',
            'title': 'Correo',
            'placeholder': 'Ingrese el correo',
            'msg':{
                'error':'Este campo es obligatorio',
                'email':'Correo invalido',
            }
        }
        this.rules = Object.assign({},this.rules,this.getRulesDefault())
    }
    initPermissions() {}
    initParamsSearch() {
        this.paramsSearch.title="Buscar Choferes";
        this.paramsSearch.placeholder="Ingrese chofer";
    }
    initParamsSave() {
        this.paramsSave.title="Agregar chofer"
    }
    initRuleObject() {
        this.ruleObject.title="Chofer";
        this.ruleObject.placeholder="Ingrese chofer";
        this.ruleObject.key="chofer";
    }
    initRulesSave() {
        let _rules = Object.assign({},this.rules);
        delete _rules.enabled;
        this.ruleSave = Object.assign({},_rules);
    }

}