import {globalService} from "../common/globalService";
import {ModelBase} from "../common/modelBase";
import {MCompany} from "../empresa/MCompany";
import {MTrashType} from "../tipoBasura/MTrashType";

export class MZone extends ModelBase{

    private _company:MCompany;
    private _trash:MTrashType;

    constructor(public myglobal:globalService){
        super('ZONE','/zones/',myglobal);
        this.initModel();
    }
    modelExternal() {
        this._company = new MCompany(this.myglobal);
        this._trash = new MTrashType(this.myglobal);
    }
    initRules(){

        this.rules['code'] = {
            'type': 'text',
            'icon': 'fa fa-font',
            'required': true,
            'maxLength': '50',
            'update': this.permissions.update,
            'search': this.permissions.filter,
            'visible': this.permissions.visible,
            'key': 'code',
            'title': 'Código',
            'placeholder': 'Ingrese el código',
        };

        this.rules['name'] = {
            'type': 'text',
            'icon': 'fa fa-font',
            'required': true,
            'maxLength': '50',
            'update': this.permissions.update,
            'search': this.permissions.filter,
            'visible': this.permissions.visible,
            'key': 'name',
            'title': 'Nombre',
            'placeholder': 'Nombre',
        };

        this.rules['urlAntenna'] = {
            'type': 'text',
            'icon': 'fa fa-font',
            'required': true,
            'update': this.permissions.update,
            'search': this.permissions.filter,
            'visible': this.permissions.visible,
            'key': 'urlAntenna',
            'title': 'Antena',
            'placeholder': 'Dirección de la antena',
        };

        this.rules['urlBalance'] = {
            'type': 'text',
            'icon': 'fa fa-font',
            'required': true,
            'update': this.permissions.update,
            'search': this.permissions.filter,
            'visible': this.permissions.visible,
            'key': 'urlBalance',
            'title': 'Balanza',
            'placeholder': 'Dirección de la bascula',
        };

        this.rules['company']=this._company.ruleObject;
        this.rules['company'].update=this.permissions.update;

        this.rules['trashType']=this._trash.ruleObject;
        this.rules['trashType'].update=this.permissions.update;

        this.mergeRules();

        delete this.rules['detail'];
    }
    initPermissions() {}
    initParamsSearch() {
        this.paramsSearch.title="Buscar una zona";
        this.paramsSearch.placeholder="Ingrese la zona";
    }
    initParamsSave() {
        this.paramsSave.title="Agregar una zona"
    }
    initRuleObject() {
        this.ruleObject.title="Zona";
        this.ruleObject.placeholder="Ingrese la zona";
        this.ruleObject.key="zone";
        this.ruleObject.keyDisplay="zoneCode";
        this.ruleObject.code="zoneId";
    }
    initRulesSave() {
        this.rulesSave = Object.assign({},this.rules);
        delete this.rulesSave.enabled;
    }

}

