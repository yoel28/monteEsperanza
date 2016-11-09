import {globalService} from "../common/globalService";
import {ModelBase} from "../common/modelBase";
import {MCompany} from "../empresa/MCompany";

export class MContainer extends ModelBase{
    public rules={};

    public company;
    constructor(public myglobal:globalService){
        super('CONTAINER','/containers/',myglobal);
        this.initModel();
    }
    
    modelExternal() {
        this.company = new MCompany(this.myglobal);
    }

    initRules() {

        this.rules['code'] = {
            'type': 'text',
            'required': true,
            'update': this.permissions.update,
            'search': this.permissions.filter,
            'visible': this.permissions.visible,
            'key': 'code',
            'title': 'Codigo',
            'placeholder': 'Ingrese codigo',
        };
        this.rules['title'] = {
            'type': 'text',
            'required': true,
            'update': this.permissions.update,
            'search': this.permissions.filter,
            'visible': this.permissions.visible,
            'key': 'title',
            'title': 'Titulo',
            'placeholder': 'Ingrese titulo',
        };
        this.rules['company'] =  this.company.ruleObject;
        this.rules['company'].required=false;
        this.rules['company'].update=this.permissions.update;

        this.rules = Object.assign({},this.rules,this.getRulesDefault())
    }
    initPermissions() {}
    initParamsSearch() {
        this.paramsSearch.title="Buscar container";
        this.paramsSearch.placeholder="Ingrese container";
        this.paramsSearch.label.title="Código: ";
        this.paramsSearch.label.detail="Titulo: ";
    }
    initParamsSave() {
        this.paramsSave.title="Agregar container"
    }
    initRuleObject() {
        this.ruleObject.title="Container";
        this.ruleObject.placeholder="Ingrese container";
        this.ruleObject.key="container";
        this.ruleObject.keyDisplay="containerCode";
        this.ruleObject.code="containerId";
    }
    initRulesSave() {
        this.rulesSave = Object.assign({},this.rules);
        delete this.rulesSave.enabled;
    }

}