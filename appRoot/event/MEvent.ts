import {globalService} from "../common/globalService";
import {ModelBase} from "../common/modelBase";
import {HttpUtils} from "../common/http-utils";
import {Http} from '@angular/http';
import {MRegla} from "../regla/MRegla";


export class MEvent extends ModelBase{
    public rules:any={};
    public publicData:any={};
    public _MRegla:any={};
    public httpUtils:HttpUtils;

    constructor(public myglobal:globalService,public http:Http ){
        super('EVENT','/events/',myglobal);
        this.httpUtils = new HttpUtils(http);
        this._MRegla = new MRegla(myglobal);

        this.initModel();
        this.loadData();
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
        this.rules['actionType']={
            'type': 'select',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'source': [],
            'key': 'actionType',
            'title': 'Tipo de acción',
            'placeholder': 'Selecccione una opcion',
            'msg':{
                'error':'Este campo es obligatorio',
            }
        }
        this.rules['way']={
                'type': 'select',
                'required':true,
                'update':this.permissions.update,
                'search':this.permissions.filter,
                'visible':this.permissions.visible,
                'source': [],
                'key': 'way',
                'title': 'Canal',
                'placeholder': 'Selecccione una opcion',
                'msg':{
                    'error':'Este campo es obligatorio',
                }
            }
        this.rules['over']={
            'type': 'select',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'source':[],
            'key': 'over',
            'title': 'Dominio',
            'placeholder': 'Seleccione un dominio',
            'msg':{
                'error':'Este campo es obligatorio',
            }
        }

        this.rules['message']={
            'type': 'textarea',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'message',
            'icon': 'fa fa-key',
            'title': 'Mensaje',
            'placeholder': 'Ingrese el mensaje',
            'msg':{
                'error':'Este campo es obligatorio',
            }
        }
        this.rules['rule']=this._MRegla.ruleObject;
        this.rules['rule'].required = true;
        this.rules['target']={
            'type': 'text',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'target',
            'icon': 'fa fa-key',
            'title': 'Objectivo',
            'placeholder': 'Ingrese el objetivo',
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
            'title': 'Titulo',
            'placeholder': 'Ingrese el titulo',
            'msg':{
                'error':'Este campo es obligatorio',
            }
        }
        this.rules['icon']={
            'type': 'text',
            'required':false,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'icon',
            'icon': 'fa fa-key',
            'title': 'Icono',
            'placeholder': 'Ingrese el icono',
            'msg':{
                'error':'Este campo es obligatorio',
            }
        }

        this.rules = Object.assign({},this.rules,this.getRulesDefault())
    }
    initPermissions() {}
    initParamsSearch() {
        this.paramsSearch.title="Buscar eventos";
        this.paramsSearch.placeholder="Ingrese codigo del evento";
    }
    initRuleObject() {
        this.ruleObject.title="Eventos";
        this.ruleObject.placeholder="Ingrese codigo del evento";
        this.ruleObject.key="event";
    }
    initRulesSave() {
        let _rules = Object.assign({},this.rules);
        delete _rules.detail;
        delete _rules.enable;
        this.ruleSave = Object.assign({},_rules);
    }
    loadData()
    {
        let that = this;
        let successCallback= response => {
            Object.assign(this.publicData,response.json())
            this.publicData.domains.forEach(obj=>{
                that.rules.over.source.push({'value':obj.name,'text':obj.logicalPropertyName});
            });
            this.publicData.event.actionTypes.forEach(obj=>{
                that.rules.actionType.source.push({'value':obj,'text':obj});
            });
            this.publicData.event.wayTypes.forEach(obj=>{
                that.rules.way.source.push({'value':obj,'text':obj});
            })
        }
        this.httpUtils.doGet(localStorage.getItem('url'),successCallback,null,true)
    }

}