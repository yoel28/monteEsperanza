import {globalService} from "../common/globalService";
import {ModelBase} from "../common/modelBase";
import {MVehicle} from "../vehiculo/MVehicle";
import {MContainer} from "../container/MContainer";

export class MTag extends ModelBase{
    public rules={};

    public vehicle:any;
    public container:any;
    constructor(public myglobal:globalService){
        super('TAG','/rfids/',myglobal);
        this.initModel();
    }
    modelExternal() {
        this.vehicle = new MVehicle(this.myglobal);
        this.container = new MContainer(this.myglobal);
    }
    initRules(){
        this.rules['number']={
            'type': 'text',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'number',
            'title': 'Número del Tag',
            'placeholder': 'Número del Tag',
        }
        this.rules = Object.assign({},this.rules,this.getRulesDefault())
    }
    initPermissions() {}
    initParamsSearch() {
        this.paramsSearch.title="Buscar Tag RFID";
        this.paramsSearch.placeholder="Ingrese tag RFID";
        this.paramsSearch.where="&where="+encodeURI("[['op':'isNull','field':'tag.id']]");
    }
    initParamsSave() {
        this.paramsSave.title="Agregar tag RFID"
    }
    initRuleObject() {
        this.ruleObject.title="Tag RFID";
        this.ruleObject.placeholder="Ingrese tag RFID";
        this.ruleObject.key="rfid";
    }
    initRulesSave() {
        this.rulesSave = Object.assign({},this.rules);
        delete this.rulesSave.enabled;
        delete this.rulesSave.detail;
    }

}