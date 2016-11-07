import {globalService} from "../common/globalService";
import {ModelBase} from "../common/modelBase";
import {MCompany} from "../empresa/MCompany";
import {MDrivers} from "../drivers/MDrivers";
import {MTypeVehicle} from "../tipoVehiculo/MTypeVehicle";

export class MVehicle extends ModelBase{
    public rules={};

    public vehicleType:any;
    public company:any;
    public driver:any;

    constructor(public myglobal:globalService){
        super('VEH','/vehicles/',myglobal);
        this.initModel();
    }
    modelExternal() {
        this.vehicleType = new MTypeVehicle(this.myglobal);
        this.company = new MCompany(this.myglobal);
        this.driver = new MDrivers(this.myglobal);
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

        this.rules['plate']={
            'type': 'text',
            'icon':'fa fa-font',
            'required':true,
            'maxLength':'35',
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'plate',
            'title': 'Placa',
            'placeholder': 'Placa del vehículo',
        };

        this.rules['weight']={
            'type': 'number',
            'step':'0.0001',
            "double":true,
            'icon':'fa fa-font',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'weight',
            'title': 'Peso',
            'placeholder': 'Peso del vehículo',
        };

        this.rules['vehicleType'] = this.vehicleType.ruleObject;

        this.rules['company']=this.company.ruleObject;

        this.rules['chofer']=this.driver.ruleObject;

        this.rules['minBalance']={
            'type': 'number',
            'step':'0.01',
            "double":true,
            'icon':'fa fa-font',
            'required':true,
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'minBalance',
            'title': 'Balance minimo',
            'placeholder': 'Balance minimo',
        };


        this.rules = Object.assign({},this.rules,this.getRulesDefault())
    }
    initPermissions() {}
    initParamsSearch() {
        this.paramsSearch.title="Buscar vehículo";
        this.paramsSearch.placeholder="Ingrese vehículo";
        this.paramsSearch.label.title="Cliente: ";
        this.paramsSearch.label.detail="Placa: "
    }
    initParamsSave() {
        this.paramsSave.title="Agregar vehículo"
    }
    initRuleObject() {
        this.ruleObject.title="Vehículo";
        this.ruleObject.placeholder="Ingrese vehículo";
        this.ruleObject.key="vehicle";
    }
    initRulesSave() {
        this.rulesSave = Object.assign({},this.rules);
        delete this.rulesSave.enabled;
    }

}
