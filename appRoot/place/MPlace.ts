import {globalService} from "../common/globalService";
import {ModelBase} from "../common/modelBase";
import {MRuta} from "../ruta/MRuta";

export class MPlace extends ModelBase{
    public rules={};
    private route;
    constructor(public myglobal:globalService){
        super('PLACE','/places/',myglobal);
        this.initModel();
    }
    modelExternal() {
        this.route = new MRuta(this.myglobal);
    }
    initRules(){

        this.rules['title']={
            'type': 'text',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'title',
            'title': 'Título',
            'placeholder': 'Título',
        };
        this.rules['route'] = this.route.ruleObject;
        this.rules['route'].required = true;

        this.rules = Object.assign({},this.rules,this.getRulesDefault());
        this.rules['detail'].required  = true;
    }
    initPermissions() {}
    initParamsSearch() {
        this.paramsSearch.title="Buscar lugar";
        this.paramsSearch.placeholder="Ingrese el lugar";
    }
    initParamsSave() {
        this.paramsSave.title="Agregar lugar"
    }
    initRuleObject() {
        this.ruleObject.title="Lugares";
        this.ruleObject.placeholder="Ingrese lugar";
        this.ruleObject.key="place";
        this.ruleObject.keyDisplay="placeTitle";
        this.ruleObject.code="placeId";
    }
    initRulesSave() {
        this.rulesSave = Object.assign({},this.rules);
        delete this.rulesSave.enabled;
    }

}