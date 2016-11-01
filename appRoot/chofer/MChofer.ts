import {globalService} from "../common/globalService";
import {ModelBase} from "../common/modelBase";
import {HttpUtils} from "../common/http-utils";
import {Http} from '@angular/http';
import {MRegla} from "../regla/MRegla";


export class MChofer extends ModelBase{
    public rules:any={};

    constructor(public myglobal:globalService){
        super('CHOFER','/chofer/',myglobal);

        this.initModel();
    }
    initRules(){
        this.rules['code']={
            'type': 'text',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'code',
            'icon': 'fa fa-key',
            'title': 'Codigo',
            'placeholder': 'Ingrese el codigo',
            'msg':{
                'error':'Este campo es obligatorio',
            }
        };

        this.rules = Object.assign({},this.rules,this.getRulesDefault())
    }
    initPermissions() {}
    initParamsSearch() {
        this.paramsSearch.title="Buscar chofer";
        this.paramsSearch.placeholder="Ingrese codigo del chofer";
    }
    initParamsSave() {
        this.paramsSave.title="Agregar chofer"
    }
    initRuleObject() {
        this.ruleObject.title="Chofer";
        this.ruleObject.placeholder="Ingrese codigo del chofer";
        this.ruleObject.key="chofer";
    }
    initRulesSave() {
        let _rules = Object.assign({},this.rules);
        delete _rules.detail;
        delete _rules.enable;
        this.ruleSave = Object.assign({},_rules);
    }

}