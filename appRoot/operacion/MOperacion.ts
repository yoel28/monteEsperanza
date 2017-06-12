import {globalService} from "../common/globalService";
import {ModelBase} from "../common/modelBase";
import {MRuta} from "../ruta/MRuta";
import {MTrashType} from "../tipoBasura/MTrashType";
import {MCompany} from "../empresa/MCompany";
import {MDrivers} from "../drivers/MDrivers";
import {MVehicle} from "../vehiculo/MVehicle";
import {MPlace} from "../place/MPlace";
import {ContainerModel} from "../com.zippyttech.vertedero/catalog/container/container.model";

export class MOperacion extends ModelBase{
    public rules={};

    public route:any;
    public trashType:any;
    public company:any;
    public chofer:any;
    public vehicle:any;
    public container:any;
    public place:any;

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
        this.container = new ContainerModel(this.myglobal);
        this.place = new MPlace(this.myglobal);
    }
    initRules(){

        this.rules['vehicle']=this.vehicle.ruleObject;
        this.rules['vehicle'].readOnly=this.permissions['lockVeh'];
        this.rules['vehicle'].protected=this.permissions['lockVeh'];
        this.rules['vehicle'].update=this.permissions.update;

        this.rules['dateCreated']={
            'type': 'date',
            'display': null,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'dateCreated',
            'icon':'fa fa-calendar',
            'title': 'Fecha de entrada',
            'placeholder': 'Fecha de entrada',
        };
        this.rules['recharge']={
            'type': 'text',
            'search':this.permissions.filter,
            'key': 'r.reference',
            'icon':'fa fa-list',
            'title': 'Recibo',
            'placeholder': 'Recibo',
        };


        this.rules['container']=this.container.ruleObject;
        this.rules['container'].required=false;
        this.rules['container'].update=this.permissions.update;
        this.rules['container'].refreshField={
            'icon':'fa fa-refresh',
            'endpoint':'/read/containers/',
            'field':'containers',
            'callback':(form,data)=>{
                if(data && data.container){
                    form.searchId['container']={};
                    form.data['container'].updateValue(data.container.detail);
                    form.searchId['container']={'id':data.container.id,'title':data.container.title,'detail':data.container.detail};
                }
            }
        };


        this.rules['chofer']=this.chofer.ruleObject;
        this.rules['chofer'].required=false;
        this.rules['chofer'].update=this.permissions.update;

        this.rules['company']=this.company.ruleObject;
        this.rules['company'].update=this.permissions.update;

        this.rules['trashType']=this.trashType.ruleObject;
        this.rules['trashType'].update=this.permissions.update;

        this.rules['route']=this.route.ruleObject;
        this.rules['route'].update=this.permissions.update;

        this.rules['place'] = {
            'type': 'list',
            'maxLength': '35',
            'prefix':'TAG',
            'value':[],
            'update': this.permissions.update,
            'search': this.permissions.filter && false,
            'visible': this.permissions.visible,
            'key': 'place',
            'title': 'Lugares',
            'placeholder': 'Lugares',
            'instance':null
        };



        this.rules['weightIn']={
                'type': 'number',
                'readOnly': this.permissions['lockWeight'],
                'protected': this.permissions['lockWeight'],
                'step':'0.001',
                'required':true,
                'hidden': false,
                'double': true,
                'update':this.permissions.update,
                'search':this.permissions.filter && false,
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
            };

        this.rules['weightOut']={
            'type': 'number',
            'readOnly': this.permissions['lockWeight'],
            'protected': this.permissions['lockWeight'],
            'step':'0.001',
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
        };

        this.rules['pendingWeightIn']={
            'type': 'number',
            'readOnly': true,
            'protected': true,
            'step':'0.001',
            'required':false,
            'double': true,
            'update':false,
            'search':false,
            'hidden': true,
            'key': 'pendingWeightIn',
            'visible':this.permissions.visible,
            'icon':'fa fa-balance-scale',
            'title': 'Peso automatico E.',
            'placeholder': 'Peso automatico de entrada',
        };

        this.rules['pendingWeightOut']={
            'type': 'number',
            'readOnly': true,
            'protected': true,
            'step':'0.001',
            'required':false,
            'double': true,
            'update':false,
            'search':false,
            'key': 'pendingWeightOut',
            'visible':this.permissions.visible,
            'hidden': true,
            'icon':'fa fa-balance-scale',
            'title': 'Peso automatico S.',
            'placeholder': 'Peso automatico de salida',
        };

        this.rules['pendingRouteCode']={
            'type': 'text',
            'update':false,
            'search':false,
            'key': 'pendingRouteCode',
            'visible':this.permissions.visible,
            'title': 'Ruta automatica',
            'placeholder': 'Ruta automatica',
        };

        this.rules['comment']={
            'type': 'textarea',
            'required':false,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'comment',
            'icon':'fa fa-font',
            'title': 'Comentarios',
            'placeholder': 'Ingrese un comentario',
        };
        
        this.rules = Object.assign({},this.rules,this.getRulesDefault());
        delete this.rules['detail'];
    }
    initPermissions() {
        this.permissions['print'] = this.myglobal.existsPermission(this.prefix + '_PRINT');
        this.permissions['automatic'] = this.myglobal.existsPermission(this.prefix + '_AUTOMATIC');
        this.permissions['close'] = this.myglobal.existsPermission(this.prefix + '_CLOSE');
        this.permissions['viewDelete'] = this.myglobal.existsPermission(this.prefix + '_VIEWDELETE');
        this.permissions['viewAdd'] = this.myglobal.existsPermission(this.prefix + '_VIEW_ADD');
        this.permissions['lockWeight'] = this.myglobal.existsPermission(this.prefix + '_LOCK_WEIGHT');
        this.permissions['lockVeh'] = this.myglobal.existsPermission(this.prefix + '_LOCK_VEH');
        this.permissions['image'] = this.myglobal.existsPermission(this.prefix + '_IMAGE') ;

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
        delete this.rulesSave.recharge;
        delete this.rulesSave.pendingRouteCode;
    }

}