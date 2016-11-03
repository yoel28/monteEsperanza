import {globalService} from "../common/globalService";
import {ModelBase} from "../common/modelBase";

export class MTrashType extends ModelBase{
    public rules={};

    public WEIGTH_METRIC_SHORT:string="";
    public WEIGTH_METRIC:string="";
    public MONEY_METRIC_SHORT:string="";
    public MONEY_METRIC:string="";


    constructor(public myglobal:globalService){
        super('TRASH_TYPE','/type/trash/',myglobal);
        this.initLoadParams();
        this.initModel();
    }
    
    
    initRules(){

        this.rules['title']={
            'type': 'text',
            'icon':'fa fa-font',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'title',
            'title': 'Título',
            'placeholder': 'Título',
            'msg':{
                'error':this.msg.error,
            }
        };

        this.rules['price']={
            'type': 'number',
            'icon':'fa fa-money',
            'required':true,
            'double':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'price',
            'title': 'Precio ('+this.MONEY_METRIC_SHORT+')',
            'placeholder': 'Precio',
            'msg':{
                'error':this.msg.error,
            }
        };

        this.rules['min']={
            'type': 'number',
            'icon':'fa fa-balance-scale',
            'required':true,
            'double':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'min',
            'title': 'Peso mínimo ('+this.WEIGTH_METRIC_SHORT+')',
            'placeholder': 'Peso mínimo',
            'msg':{
                'error':this.msg.error,
            }
        };

        this.rules['minPrice']={
            'type': 'number',
            'icon':'fa fa-money',
            'required':true,
            'double':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'minPrice',
            'title': 'Precio mínimo ('+this.MONEY_METRIC_SHORT+')',
            'placeholder': 'Precio mínimo',
            'msg':{
                'error':this.msg.error,
            }
        };

        this.rules['reference']={
            'type': 'text',
            'icon':'fa fa-list',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'reference',
            'title': 'Referencia',
            'placeholder': 'Referencia',
            'msg':{
                'error':this.msg.error,
            }
        };
        
        this.rules = Object.assign({},this.rules,this.getRulesDefault())
    }
    initPermissions() {}
    initParamsSearch() {
        this.paramsSearch.title="Buscar tipo de basura";
        this.paramsSearch.placeholder="Ingrese tipo de basura";
    }
    initParamsSave() {
        this.paramsSave.title="Agregar tipo de basura"
    }
    initRuleObject() {
        this.ruleObject.title="Tipo de basura";
        this.ruleObject.placeholder="Ingrese tipo de basura";
        this.ruleObject.key="trashType";
    }
    initRulesSave() {
        this.rulesSave = Object.assign({},this.rules);
        delete this.rulesSave.enabled;
    }


    initLoadParams(){
        this.WEIGTH_METRIC_SHORT=this.myglobal.getParams('WEIGTH_METRIC_SHORT');
        this.WEIGTH_METRIC=this.myglobal.getParams('WEIGTH_METRIC');
        this.MONEY_METRIC_SHORT=this.myglobal.getParams('MONEY_METRIC_SHORT');
        this.MONEY_METRIC=this.myglobal.getParams('MONEY_METRIC');
    }


}