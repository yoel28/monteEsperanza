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

        this.rules['vehicle']=this.vehicle.ruleObject;
        this.rules['vehicle'].unique=true;
        this.rules['vehicle'].keyDisplay="vehiclePlate";
        this.rules['vehicle'].required=false;
        this.rules['vehicle'].update=this.permissions.update;
        this.rules['vehicle'].disabled = "data.containerId?true:false";
        this.rules['vehicle'].paramsSearch.where="&where="+encodeURI("[['op':'isNull','field':'tag.id']]");
        

        this.rules['container']=this.container.ruleObject;
        this.rules['container'].unique=true;
        this.rules['container'].keyDisplay="containerCode";
        this.rules['container'].required=false;
        this.rules['container'].update=this.permissions.update;
        this.rules['container'].disabled = "data.vehicleId?true:false";
        this.rules['container'].paramsSearch.where="&where="+encodeURI("[['op':'isNull','field':'tag.id']]");

        this.rules['number']={
            'type': 'text',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'number',
            'title': 'Número del Tag',
            'placeholder': 'Número del Tag',
        };
        this.rules['code']={
            'type': 'text',
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'code',
            'title': 'Código',
            'placeholder': 'Código de Tag',
        };

        this.rules = Object.assign({},this.rules,this.getRulesDefault());
        delete this.rules['detail'];
    }
    initPermissions() {}
    initParamsSearch() {
        this.paramsSearch.title="Buscar Tag RFID";
        this.paramsSearch.placeholder="Ingrese tag RFID o Código";
        this.paramsSearch.where="";
        this.paramsSearch.label.detail = 'Tag: ';
        this.paramsSearch.label.title = 'Código: ';
    }
    initParamsSave() {
        this.paramsSave.title="Agregar tag RFID"
    }
    initRuleObject() {
        this.ruleObject.title="Tag RFID";
        this.ruleObject.placeholder="Ingrese tag RFID";
        this.ruleObject.key="tag";
        this.ruleObject.code="tagId";
        this.ruleObject.keyDisplay="tagNumber";
    }
    initRulesSave() {
        this.rulesSave = Object.assign({},this.rules);
        delete this.rulesSave.enabled;
        delete this.rulesSave['vehicle'];
        delete this.rulesSave['container'];
    }

}