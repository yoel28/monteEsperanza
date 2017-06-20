import {globalService} from "../common/globalService";
import {ModelBase} from "../common/modelBase";
import {MCompanyType} from "../tipoEmpresa/MTypeCompany";
import {MTrashType} from "../tipoBasura/MTrashType";
import {MRuta} from "../ruta/MRuta";

export class MCompany extends ModelBase{

    public typeCompany:any;
    public trashType:any;
    public route:any;

    constructor(public myglobal:globalService){
        super('COMPANY','/companies/',myglobal);
        this.initModel();
    }
    modelExternal() {
        this.typeCompany = new MCompanyType(this.myglobal);
        this.trashType = new MTrashType(this.myglobal);
        this.route = new MRuta(this.myglobal);
    }
    initRules(){

        this.rules['image']={
            'type': 'image',
            'update':this.permissions.update,
            'visible':this.permissions.visible,
            'key': 'image',
            'title': 'Imagen',
            'placeholder': 'Imagen',
        };
        this.rules['name']={
            'type': 'text',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'name',
            'title': 'Nombre',
            'placeholder': 'Nombre',
        };
        this.rules['ruc']={
            'type': 'text',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'ruc',
            'title': 'RUC',
            'setEqual':'code',
            'placeholder': 'RUC',
        };
        this.rules['code']={
            'type': 'text',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'code',
            'title': 'Código',
            'placeholder': 'Código',
        };
        this.rules['responsiblePerson']={
            'type': 'text',
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'responsiblePerson',
            'title': 'Responsable',
            'placeholder': 'Responsable',
        };
        this.rules['phone']={
            'type': 'text',
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'phone',
            'title': 'Teléfono',
            'placeholder': 'Teléfono',
        };
        this.rules['minBalance']={
            'type': 'number',
            'step':'0.001',
            'double':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'minBalance',
            'title': 'Balance mínimo',
            'placeholder': 'Balance mínimo',
        };
        this.rules['balance']={
            'type': 'number',
            'required':true,
            'double':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'balance',
            'title': 'Balance',
            'placeholder': 'Balance',
        };
        this.rules['address']={
            'type': 'text',
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'address',
            'icon': 'fa fa-list',
            'title': 'Dirección',
            'placeholder': 'Dirección',
        };
        this.rules['debt']={
            'type': 'number',
            'step':'0.001',
            'required':true,
            'double':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'debt',
            'title': 'Deuda (Valores negativos)',
            'placeholder': 'Deuda',
        };

        this.rules['location']={
            'type': 'location',
            'getValue':(data:Object):Object=>{
                try{
                    let values = JSON.parse(data['location']);
                    return values;
                }
                catch (e){

                }
            },
            'update':this.permissions.update,
            'visible':this.permissions.visible,
            'key': 'location',
            'title': 'Ubicación',
            'placeholder': 'Ubicación',
        };

        this.rules['companyType'] = this.typeCompany.ruleObject;
        this.rules['companyType'].update=this.permissions.update;
        this.rules['companyType'].required = false;

        this.rules['trashType'] = this.trashType.ruleObject;
        this.rules['trashType'].update=this.permissions.update;
        this.rules['trashType'].required = false;

        this.rules['route'] = this.route.ruleObject;
        this.rules['route'].update=this.permissions.update;
        this.rules['route'].required = false;

        this.mergeRules();

    }
    initPermissions() {
        this.permissions['morosos']=this.myglobal.existsPermission('COMPANY_MOROSOS')
    }
    initParamsSearch() {
        this.paramsSearch.title="Buscar  cliente";
        this.paramsSearch.placeholder="Ingrese codigo del cliente";
        this.paramsSearch.label.title="Nombre: ";
        this.paramsSearch.label.detail="RUC: "
    }
    initParamsSave() {
        this.paramsSave.title="Agregar cliente"
    }
    initRuleObject() {
        this.ruleObject.title="Cliente";
        this.ruleObject.placeholder="Ingrese el cliente";
        this.ruleObject.key="company";
        this.ruleObject.keyDisplay="companyRuc";
        this.ruleObject.code="companyId";

    }
    initRulesSave() {
        this.rulesSave = Object.assign({},this.rules);
        delete this.rulesSave.image;
        delete this.rulesSave.enabled;
        delete this.rulesSave.balance;
        delete this.rulesSave.image;
        delete this.rulesSave.debt;
        delete this.rulesSave.location;
        delete this.rulesSave.detail;
        delete this.rulesSave.code;
    }

}