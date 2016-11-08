import {globalService} from "../common/globalService";
import {ModelBase} from "../common/modelBase";
import {MRuta} from "../ruta/MRuta";
import {MTrashType} from "../tipoBasura/MTrashType";
import {MCompany} from "../empresa/MCompany";
import {MDrivers} from "../drivers/MDrivers";
import {MVehicle} from "../vehiculo/MVehicle";
import {MContainer} from "../container/MContainer";

export class MOperacion extends ModelBase{
    public rules={};

    public route:any;
    public trashType:any;
    public company:any;
    public chofer:any;
    public vehicle:any;
    public container:any;

    constructor(public myglobal:globalService){
        super('OP','/operations/',myglobal);
        this.initModel();
    }
    modelExternal() {
        this.route = new MRuta(this.myglobal);
        this.trashType = new MTrashType(this.myglobal);
        this.company = new MCompany(this.myglobal);
        this.chofer = new MDrivers(this.myglobal);
        this.vehicle = new MVehicle(this.myglobal);
        this.container = new MContainer(this.myglobal);
    }
    initRules(){

        this.rules['vehicle']=this.vehicle.ruleObject;
        this.rules['vehicle'].update=this.permissions.update;

        this.rules['container']=this.container.ruleObject;
        this.rules['container'].required=false;
        this.rules['container'].update=this.permissions.update;


        this.rules['chofer']=this.chofer.ruleObject;
        this.rules['chofer'].update=this.permissions.update;

        this.rules['company']=this.company.ruleObject;
        this.rules['company'].update=this.permissions.update;

        this.rules['trashType']=this.trashType.ruleObject;
        this.rules['trashType'].update=this.permissions.update;

        this.rules['route']=this.route.ruleObject;
        this.rules['route'].update=this.permissions.update;

        this.rules['weightIn']={
                'type': 'number',
                'readOnly': false,
                'required':true,
                'hidden': false,
                'double': true,
                'update':this.permissions.update,
                'search':this.permissions.filter,
                'visible':this.permissions.visible,
                'key': 'weightIn',
                'icon':'fa fa-balance-scale',
                'title': 'Peso E.',
                'placeholder': 'Peso de entrada',
                'refreshField':{
                    'icon':'fa fa-refresh',
                    'endpoint':'/weight/',
                    'field':'weight',
                }
            }

        this.rules['weightOut']={
            'type': 'number',
            'readOnly': false,
            'required':false,
            'hidden': true,
            'double': true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'weightOut',
            'icon':'fa fa-balance-scale',
            'title': 'Peso S.',
            'placeholder': 'Peso de salida',
            'refreshField':{
                'icon':'fa fa-refresh',
                'endpoint':'/weight/',
                'field':'weight',
            }
        }

        this.rules['dateCreated']={
            'type': 'date',
            'display': null,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'description',
            'icon':'fa fa-calendar',
            'title': 'Fecha de entrada',
            'placeholder': 'Fecha de entrada',
        }

        this.rules['comment']={
            'type': 'textarea',
            'required':false,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'description',
            'icon':'fa fa-font',
            'title': 'Comentarios',
            'placeholder': 'Ingrese un comentario',
        }

        this.rules = Object.assign({},this.rules);
    }
    initPermissions() {
        this.permissions['print'] = this.myglobal.existsPermission(this.prefix + '_PRINT');
        this.permissions['automatic'] = this.myglobal.existsPermission(this.prefix + '_AUTOMATIC');

    }
    initParamsSearch() {
        this.paramsSearch.title="Buscar operación";
        this.paramsSearch.placeholder="Ingrese operación";
    }
    initParamsSave() {
        this.paramsSave.title="Agregar operación";
    }
    initRuleObject() {
        this.ruleObject.title="Operaciones";
        this.ruleObject.placeholder="Ingrese el codigo de la operacion";
        this.ruleObject.key="operation";
        this.ruleObject.code="operationId";
    }
    initRulesSave() {
        this.rulesSave = Object.assign({},this.rules);
        delete this.rulesSave.dateCreated;
        delete this.rulesSave.enabled;
        delete this.rulesSave.detail;
        delete this.rulesSave.id;
    }

}