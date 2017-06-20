import {globalService} from "../common/globalService";
import {ModelBase} from "../common/modelBase";
import {HttpUtils} from "../common/http-utils";
import {Http} from '@angular/http';
import {MRegla} from "../regla/MRegla";


export class MEvent extends ModelBase{

    public publicData:any={};
    public regla:any={};
    public httpUtils:HttpUtils;

    constructor(public myglobal:globalService,public http:Http ){
        super('EVENT','/events/',myglobal);
        this.httpUtils = new HttpUtils(http);
        this.initModel(false);
        this.loadData();
    }
    modelExternal() {
        this.regla = new MRegla(this.myglobal);
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
            'title': 'Código',
            'placeholder': 'Código',
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
            'placeholder': 'Selecccione un tipo de accción',
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
                'placeholder': 'Selecccione un canal',
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
        }

        this.rules['message']={
            'type': 'textarea',
            'required':true,
            'showbuttons':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'message',
            'icon': 'fa fa-key',
            'title': 'Mensaje',
            'placeholder': 'Ingrese el mensaje',
        };

        this.rules['rule']=this.regla.ruleObject;
        this.rules['rule'].required = true;
        this.rules['rule'].update=this.permissions.update;

        this.rules['target']={
            'type': 'text',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'target',
            'icon': 'fa fa-key',
            'title': 'Target',
            'placeholder': 'Destino donde se enviara el mensaje',
        };
        this.rules['trigger']={
            'type': 'text',
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'trigger',
            'icon': 'fa fa-key',
            'title': 'Trigger',
            'placeholder': 'Trigger',
        };
        this.rules['title']={
            'type': 'text',
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'title',
            'icon': 'fa fa-key',
            'title': 'Asunto',
            'placeholder': 'Asunto',
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
        }

        this.mergeRules();

        delete this.rules['detail'];
    }
    initPermissions() {}
    initParamsSearch() {
        this.paramsSearch.title="Buscar eventos";
        this.paramsSearch.placeholder="Ingrese codigo del evento";
    }
    initParamsSave() {
        this.paramsSave.title="Agregar evento"
    }
    initRuleObject() {
        this.ruleObject.title="Eventos";
        this.ruleObject.placeholder="Ingrese codigo del evento";
        this.ruleObject.key="event";
        this.ruleObject.keyDisplay="eventCode";
        this.ruleObject.code="eventId";
    }
    initRulesSave() {
        this.rulesSave = Object.assign({},this.rules);
        delete this.rulesSave.detail;
        delete this.rulesSave.enabled;
    }
    loadData()
    {
        let that = this;
        let successCallback= response => {
            Object.assign(that.publicData,response.json())
            that.publicData.domains.forEach(obj=>{
                that.rules['over'].source.push({'value':obj.name,'text':obj.logicalPropertyName});
            });
            that.publicData.event.actionTypes.forEach(obj=>{
                that.rules['actionType'].source.push({'value':obj,'text':obj});
            });
            that.publicData.event.wayTypes.forEach(obj=>{
                that.rules['way'].source.push({'value':obj,'text':obj});
            })
            that.completed = true;
        }
        this.httpUtils.doGet(localStorage.getItem('url'),successCallback,null,true)
    }

}