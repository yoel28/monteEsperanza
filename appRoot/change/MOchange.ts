import {globalService} from "../common/globalService";
import {ModelBase} from "../common/modelBase";
import {MRuta} from "../ruta/MRuta";
import {MVehicle} from "../vehiculo/MVehicle";
import {MCompany} from "../empresa/MCompany";
import {MContainer} from "../container/MContainer";

export class MChange extends ModelBase {

    private vehicle;
    private route;
    private company;
    private containerOut;
    private containerIn;
    public rules={};
    constructor(public myglobal:globalService){
        super('CHANGES','/changes/',myglobal);
        this.initModel();
    }

    modelExternal() {
        this.route = new MRuta(this.myglobal);
        this.vehicle = new MVehicle(this.myglobal);
        this.company = new MCompany(this.myglobal);
        this.containerOut = new MContainer(this.myglobal);
        this.containerIn = new MContainer(this.myglobal);

    }
    initRules() {

        this.rules['latitud']={
            'type': 'number',
            'double':true,
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'latitud',
            'title': 'Latitud',
            'placeholder': 'Latitud',
        };
        this.rules['longitud']={
            'type': 'number',
            'double':true,
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'longitud',
            'title': 'Longitud',
            'placeholder': 'Longitud',
        };
        this.rules['fullPercent']={
            'type': 'number',
            'double':true,
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'fullPercent',
            'title': 'Completado',
            'placeholder': 'Completado',
        };

        this.rules['route'] = this.route.ruleObject;
        this.rules['route'].update=this.permissions.update;
        this.rules['route'].required = false;

        this.rules['vehicle'] = this.vehicle.ruleObject;
        this.rules['vehicle'].update=this.permissions.update;
        this.rules['vehicle'].required = false;
        this.rules['vehicle'].keyDisplay = 'vehiclePlate';

        this.rules['company'] = this.company.ruleObject;
        this.rules['company'].update=this.permissions.update;
        this.rules['company'].required = false;
        this.rules['company'].keyDisplay = 'companyRUC';

        this.rules['containerIn'] = this.containerIn.ruleObject;
        this.rules['containerIn'].update=this.permissions.update;
        this.rules['containerIn'].required = false;
        this.rules['containerIn'].paramsSearch.field='containerIn.id';
        this.rules['containerIn'].paramsSearch.placeholder='Ingrese contenedor de entrada';
        this.rules['containerIn'].title='Contenedor Ent.';
        this.rules['containerIn'].code = 'containerInId';
        this.rules['containerIn'].key = 'containerIn';
        this.rules['containerIn'].keyDisplay = 'containerInCode';
        this.rules['containerIn'].placeholder = 'Ingrese contenedor de entrada';

        this.rules['containerOut'] = this.containerOut.ruleObject;
        this.rules['containerOut'].update=this.permissions.update;
        this.rules['containerOut'].required = false;
        this.rules['containerOut'].paramsSearch.field='containerOut.id';
        this.rules['containerOut'].title='Contenedor Sal.';
        this.rules['containerOut'].code = 'containerOutId';
        this.rules['containerOut'].key = 'containerOut';
        this.rules['containerOut'].keyDisplay = 'containerOutCode';
        this.rules['containerOut'].paramsSearch.placeholder="Ingrese contenedor de salida";
        this.rules['containerOut'].placeholder="Ingrese contenedor de salida";



        // this.rules = Object.assign({},this.rules,this.getRulesDefault())
    }
    initPermissions() {

        this.permissions['map'] = this.myglobal.existsPermission(this.prefix + '_MAP');
    }
    initParamsSearch() {
        this.paramsSearch.title="Buscar movimientos de contenedores";
        this.paramsSearch.placeholder="Ingrese movimiento";
        this.paramsSearch.label.title="Cliente: ";
        this.paramsSearch.label.detail="Placa: ";
    }
    initParamsSave() {
        this.paramsSave.title="Agregar movimiento"
    }
    initRuleObject() {
    }
    initRulesSave() {
        this.rulesSave = Object.assign({},this.rules);
        delete this.rulesSave.enabled;
    }

}