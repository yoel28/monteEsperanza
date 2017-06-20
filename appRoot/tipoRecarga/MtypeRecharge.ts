import {globalService} from "../common/globalService";
import {ModelBase} from "../common/modelBase";

export class MtypeRecharge extends ModelBase{

    constructor(public myglobal:globalService){
        super('TRECARG','/type/recharges/',myglobal);
        this.initModel();
    }
    modelExternal() {}
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
        this.rules['icon']={
            'type': 'select',
            'required':true,
            'icon':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'source': [
                {'value':'fa fa-cc-amex','text':'American express'},
                {'value':'fa fa-cc-mastercard','text':'Master card'},
                {'value':'fa fa-credit-card','text':'Credit card'},
                {'value':'fa fa-cc-diners-club','text':'Diners club'},
                {'value':'fa fa-cc-paypal','text':'Paypal'},
                {'value':'fa fa-google-wallet','text':'Google wallet'},
                {'value':'fa fa-cc-discover','text':'Discover'},
                {'value':'fa fa-cc-stripe','text':'Stripe'},
                {'value':'fa fa-paypal','text':'Paypal'},
                {'value':'fa fa-cc-jcb','text':'Jcb'},
                {'value':'fa fa-cc-visa','text':'Visa'},
                {'value':'fa fa-money','text':'Money'},
                {'value':'fa fa-refresh','text':'Transfer'},
                {'value':'fa fa-reply','text':'Reply'}
            ],
            'key': 'icon',
            'title': 'Icono',
            'placeholder': 'Selecccione un un icono',
        };

        this.mergeRules();

    }
    initPermissions() {}
    initParamsSearch() {
        this.paramsSearch.title="Buscar un tipo de recarga";
        this.paramsSearch.placeholder="Ingrese el tipo de recarga";
        this.paramsSearch.label.title="Título: ";
        this.paramsSearch.label.detail="Detalle: ";
    }
    initParamsSave() {
        this.paramsSave.title="Agregar tipo de recarga";
    }
    initRuleObject() {
        this.ruleObject.title="Tipo de recarga";
        this.ruleObject.placeholder="Ingrese el tipo de recarga";
        this.ruleObject.key="typeRecharge";
        this.ruleObject.keyDisplay="typeRechargeTitle";
        this.ruleObject.code="typeRechargeId";
    }
    initRulesSave() {
        this.rulesSave = Object.assign({},this.rules);
        delete this.rulesSave.enabled;
    }

}