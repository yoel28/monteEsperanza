import {globalService} from "../common/globalService";
import {ModelBase} from "../common/modelBase";
import {MDrivers} from "../drivers/MDrivers";
import {MCompany} from "../empresa/MCompany";
import {MTag} from "../tagRfid/MTag";
import {MVehicle} from "../vehiculo/MVehicle";
import {CatalogApp} from "../common/catalogApp";

export class MRegister extends ModelBase{
    public rules={};

    public chofer:any;
    public company:any;
    public tag:any;
    public vehicle:any;

    constructor(public myglobal:globalService){
        super('REG','/registries/',myglobal);
        this.initModel();
        this.extendRulesObjectInRules(this.rules);
    }
    modelExternal() {
        this.chofer = new MDrivers(this.myglobal);
        this.company = new MCompany(this.myglobal);
        this.tag = new MTag(this.myglobal);
        this.vehicle = new MVehicle(this.myglobal);
    }
    initRules() {

        this.rules['id']={'title':'Número de transacción','type':'number'};

        this.rules['dateIn'] = {
            'type': 'date',
            'required': false,
            'format':CatalogApp.formatDatePickerDDMMYYYY,
            'icon':'glyphicon glyphicon-calendar',
            'update': this.permissions.update,
            'search': this.permissions.filter,
            'visible': this.permissions.visible,
            'key': 'dateIn',
            'title': 'Entrada',
            'placeholder': 'Entrada',
        };
        this.rules['dateOut'] = {
            'type': 'date',
            'format':CatalogApp.formatDatePickerDDMMYYYY,
            'required': false,
            'icon':'glyphicon glyphicon-calendar',
            'update': this.permissions.update,
            'search': this.permissions.filter,
            'visible': this.permissions.visible,
            'key': 'dateOut',
            'title': 'Salida',
            'placeholder': 'Salida',
        };

        this.rules['ubicacion'] = {
            'type': 'text',
            'required': true,
            'update': this.permissions.update,
            'search': this.permissions.filter,
            'visible': this.permissions.visible,
            'key': 'ubicacion',
            'title': 'Ubicación',
            'placeholder': 'Ubicación',
        };

        this.rules['timeIn']={
            'type': 'time',
            'required':false,
            'step':'0',
            'search': this.permissions.filter,
            'key': 'timeIn',
            'icon': 'fa fa-clock-o',
            'title': 'Tiempo en vertedero',
            'placeholder': 'Tiempo en vertedero',
        };
        this.rules['timeOut']={
            'type': 'time',
            'required':false,
            'step':'0',
            'search': this.permissions.filter,
            'key': 'timeOut',
            'icon': 'fa fa-clock-o',
            'title': 'Tiempo fuera de vertedero',
            'placeholder': 'Tiempo fuera de vertedero',
        };

        this.rules['chofer'] = this.chofer.ruleObject;
        this.rules['chofer'].required = false;
        this.rules['chofer'].rulesSave['name'].title="Chofer";

        this.rules['company'] = this.company.ruleObject;
        this.rules['company'].required = false;
        this.rules['company'].title="Codigo del cliente";

        this.rules['tag'] = this.tag.ruleObject;
        this.rules['tag'].required = false;

        this.rules['lotValIn'] = {
            'type': 'number',
            'required':false,
            'step': '0',
            'search': this.permissions.filter,
            'key': 'lotValIn',
            'icon': 'fa fa-clock-o',
            'title': 'Lote E.',
            'placeholder': 'Lote de entrada',
        };
        this.rules['lotValOut'] = {
            'type': 'number',
            'required':false,
            'step': '0',
            'search': this.permissions.filter,
            'key': 'lotValOut',
            'icon': 'fa fa-clock-o',
            'title': 'Lote S.',
            'placeholder': 'Lote de salida',
        };


        this.rules['vehicle'] = this.vehicle.ruleObject;
        this.rules['vehicle'].rulesSave['plate'].key="vehiclePlate";
        this.rules['vehicle'].required = false;


        this.rules = Object.assign({},this.rules,this.getRulesDefault());

    }
    initPermissions() {}
    initParamsSearch() {
        this.paramsSearch.title="Buscar registro";
        this.paramsSearch.placeholder="Ingrese registro";
    }
    initParamsSave() {
        this.paramsSave.title="Agregar registo"
    }
    initRuleObject() {
        this.ruleObject.title="Registro";
        this.ruleObject.placeholder="Ingrese regisro";
        this.ruleObject.key="register";
        this.ruleObject.keyDisplay="registerId";
        this.ruleObject.code="registerId";
    }
    initRulesSave() {
        this.rulesSave = Object.assign({},this.rules);
        delete this.rulesSave.enabled;
        delete this.rulesSave.id;
    }

}