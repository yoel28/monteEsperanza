import {globalService} from "../common/globalService";
import {ModelBase} from "../common/modelBase";

export class MHelp extends ModelBase{
    public rules={};
    constructor(public myglobal:globalService){
        super('INFO','/infos/',myglobal);
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
        }
        this.rules['title']={
            'type': 'text',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'title',
            'icon': 'fa fa-key',
            'title': 'Título',
            'placeholder': 'Ingrese el título',
            'msg':{
                'error':'Este campo es obligatorio',
            }
        }
        this.rules['color']={
            'type': 'color',
            'required':true,
            'update':this.permissions.update,
            'search':false,
            'visible':this.permissions.visible,
            'key': 'color',
            'title': 'Color',
            'placeholder': '#000',
            'msg':{
                'error':'Este campo es obligatorio',
            }
        }
        this.rules['position']={
            'type': 'select',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'source': [
                {'value': 'TOP', 'text': 'Arriba'},
                {'value': 'BOTTOM', 'text':'Abajo'},
                {'value': 'LEFT', 'text': 'Izquierda'},
                {'value': 'RIGHT', 'text': 'Derecha'},
            ],
            'key': 'position',
            'subKey':'name',
            'title': 'Posición',
            'placeholder': 'Selecccione una posición',
            'msg':{
                'error':'Este campo es obligatorio',
            }
        }
        this.rules = Object.assign({},this.rules,this.getRulesDefault())
    }
    initPermissions() {}
    initParamsSearch() {
        this.paramsSearch.title="Buscar ayuda";
        this.paramsSearch.placeholder="Ingrese codigo de la ayuda";
    }
    initRuleObject() {
        this.ruleObject.title="Ayuda";
        this.ruleObject.placeholder="Ingrese codigo de la ayuda";
        this.ruleObject.key="help";
    }
    initRulesSave() {
        let _rules = Object.assign({},this.rules);
        delete _rules.detail;
        delete _rules.enable;
        this.ruleSave = Object.assign({},_rules);
    }

}