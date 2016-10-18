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
            'value':'00ff00',
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
                {'value': 'top', 'text': 'Arriba'},
                {'value': 'bottom', 'text':'Abajo'},
                {'value': 'left', 'text': 'Izquierda'},
                {'value': 'right', 'text': 'Derecha'},
            ],
            'key': 'position',
            'title': 'Posición',
            'placeholder': 'Selecccione una posición',
            'msg':{
                'error':'Este campo es obligatorio',
            }
        }
        this.rules['size']={
            'type': 'select',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'source': [
                {'value': 'fa', 'text': 'Normal'},
                {'value': 'fa-lg', 'text':'Lg'},
                {'value': 'fa-2x', 'text':'2x'},
                {'value': 'fa-3x', 'text':'3x'},
                {'value': 'fa-4x', 'text':'4x'},
                {'value': 'fa-5x', 'text':'5x'},

            ],
            'key': 'size',
            'title': 'Tamaño',
            'placeholder': 'Selecccione un tamaño',
            'msg':{
                'error':'Este campo es obligatorio',
            }
        }
        this.rules['icon']={
            'type': 'select',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'source': [
                {'value': 'fa fa-question-circle', 'text': 'Interrogante 1'},
                {'value': 'fa fa-question', 'text': 'Interrogante 2'},
            ],
            'key': 'icon',
            'title': 'Icono',
            'placeholder': 'Selecccione un icono',
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
    initParamsSave() {
        this.paramsSave.title="Agregar ayuda"
    }
    initRuleObject() {
        this.ruleObject.title="Ayuda";
        this.ruleObject.placeholder="Ingrese codigo de la ayuda";
        this.ruleObject.key="help";
    }
    initRulesSave() {
        let _rules = Object.assign({},this.rules);
        delete _rules.enabled;
        this.ruleSave = Object.assign({},_rules);
    }

}