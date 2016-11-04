import {globalService} from "../common/globalService";
import {ModelBase} from "../common/modelBase";

export class MOperationAudit extends ModelBase{

    public rules:any={};
    public publicData:any={};
    public _MRegla:any={};

    constructor(public myglobal:globalService){
        super('RE_AUDIT','/reports/operations/audit/',myglobal);

        this.initModel();
    }
    initRules(){

        //region Atributos de entradasNoRegistradas
        this.rules['dateCreated']={
            'type': 'date',
            'format':'DD-MM-YYYY, LT',
            'title': 'Creado',
        };
        this.rules['dateIn']={
            'type': 'date',
            'format':'DD-MM-YYYY, LT',
            'title': 'Entrada',
        };
        this.rules['dateOut']={
            'type': 'date',
            'format':'DD-MM-YYYY, LT',
            'title': 'Salida',
        };
        this.rules['dateUpdated']={
            'type': 'date',
            'format':'DD-MM-YYYY, LT',
            'title': 'Actualizado',
        };
        this.rules['tagRFID']={
            'type': 'text',
            'title': 'RFID',
        };
        this.rules['usernameUpdater']={
            'type': 'text',
            'title': 'Operador actualizador',
        };
        this.rules['vehiclePlate']={
            'type': 'text',
            'title': 'Placa',
        };
        this.rules['weightIn']={
            'type': 'number',
            'title': 'Peso Ent.',
        };
        this.rules['weightOut']={
            'type': 'number',
            'title': 'Peso Sal.',
        };
        //endregion

        //region Atributos de operationsSinPending
        this.rules['choferName']={
            'type': 'text',
            'title': 'Chofer',
        };
        this.rules['companyCode']={
            'type': 'text',
            'title': 'Compañia',
        };
        this.rules['companyTypeCode']={
            'type': 'text',
            'title': 'Grupo',
        };
        this.rules['rechargeDateCreated']={
            'type': 'date',
            'format':'DD-MM-YYYY, LT',
            'title': 'Registro de operación',
        };
        this.rules['rechargeQuantity']={
            'type': 'number',
            'title': 'Valor',
        };
        this.rules['rechargeReference']={
            'type': 'text',
            'title': '#Ref o #Recibo',
        };
        this.rules['routeReference']={
            'type': 'text',
            'title': 'Ruta',
        };
        this.rules['trashTypeReference']={
            'type': 'text',
            'title': 'Tipo de basura',
        };
        this.rules['usernameCreator']={
            'type': 'text',
            'title': 'Operador creador',
        };

        //endregion

        /*
        companyId:240
        companyTypeId:12
        id:1171
        rechargeId:1248
        routeId:41
        trashTypeId:14
        vehicleId:54
        */

        this.rules = Object.assign({},this.rules,this.getRulesDefault());
    }

    initPermissions() {}

    initParamsSearch() {
        this.paramsSearch.title="Buscar operación";
        this.paramsSearch.placeholder="Ingrese codigo de la operación";
    }

    initParamsSave() {}

    initRuleObject() {}

    initRulesSave() {}

}
