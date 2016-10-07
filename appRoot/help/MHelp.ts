import {globalService} from "../common/globalService";
import {ModelBase} from "../common/modelBase";

export class MHelp extends ModelBase{
    public rules={};
    constructor(public myglobal:globalService){
        super('INFO',myglobal);
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
            'type': 'select',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'source': [
                {'value': 'bg-transparent', 'text':'Transparente'},
                {'value': 'bg-red', 'text':'Rojo'},
                {'value': 'bg-blue', 'text': 'Azul'},
                {'value': 'bg-yellow', 'text': 'Amarillo'},
                {'value': 'bg-green', 'text': 'Verde'},
                {'value': 'bg-black', 'text': 'Negro'},
                {'value': 'bg-white', 'text': 'Blanco'},
                {'value': 'bg-purple', 'text': 'Purpura'},
                {'value': 'bg-fuchsia', 'text': 'Fucsia'},
                {'value': 'bg-grey', 'text': 'Gris'},
                {'value': 'bg-lime', 'text': 'Lima'},
                {'value': 'bg-maroon', 'text': 'Marron'},
                {'value': 'bg-olive', 'text': 'Oliva'},
                {'value': 'bg-orange', 'text': 'Naranja'},
                {'value': 'bg-pink', 'text': 'Rosado'},
                {'value': 'bg-aqua', 'text': 'Azul claro'},
            ],
            'key': 'color',
            'title': 'Color',
            'placeholder': 'Seleccione el color',
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
                {'value': 'fa fa-question', 'text': 'question'},
                {'value': 'fa fa-truck', 'text':'truck'},
                {'value': 'fa fa-car', 'text': 'car'},
                {'value': 'fa fa-bus', 'text': 'bus'},
                {'value': 'fa fa-taxi', 'text': 'taxi'},
                {'value': 'fa fa-list', 'text': 'list'},
            ],
            'key': 'icon',
            'title': 'Icono',
            'placeholder': 'Selecccione el icono',
            'msg':{
                'error':'Este campo es obligatorio',
            }
        }
        this.rules = Object.assign({},this.rules,this.getRulesDefault())
    }
    initPermissions() {}

}