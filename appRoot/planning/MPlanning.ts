import {globalService} from "../common/globalService";
import {ModelBase} from "../common/modelBase";
import {MRuta} from "../ruta/MRuta";
import {MVehicle} from "../vehiculo/MVehicle";
import {MDrivers} from "../drivers/MDrivers";
import {Save} from "../utils/save/save";

export class MPlanning extends ModelBase{
    public rules={};

    private _vehicle:MVehicle;
    private _chofer:MDrivers;
    private _ayudante:MDrivers;
    private _route:MRuta;

    private _paramsAdd = this.myglobal.getParams('LIST_ADD_ALL')=='true';

    constructor(public myglobal:globalService){
        super('PLANNING','/plannings/',myglobal);
        this.initModel(false);
        this.initHelpers();
    }
    modelExternal() {
        this._vehicle = new MVehicle(this.myglobal);
        this._chofer = new MDrivers(this.myglobal);
        this._ayudante = new MDrivers(this.myglobal);
        this._route = new MRuta(this.myglobal);
    }
    initRules(){

        this.rules['vehicle'] = this._vehicle.ruleObject;
        this.rules['vehicle'].required = true;
        this.rules['vehicle'].callBack= (save:Save,value:string)=>{
            let data  = save.searchId['vehicle']?save.searchId['vehicle'].data:null;
            if(data && !data.available){
                this.myglobal.toastr.warning('Posee una planificacion cargada que sera desactivada','Advertencia: vehiculo '+data.plate);
            }
        };

        this.rules['driver'] = this._chofer.ruleObject;
        this.rules['driver'].required = true;
        this.rules['driver'].key = 'driver';
        this.rules['driver'].code = 'driverId';
        this.rules['driver'].keyDisplay = 'driverName';
        this.rules['driver'].paramsSearch.where="[['op':'eq','field':'avaliable','value':true]]";


        this.rules['helpers'] = {
            type: 'select2',
            showbuttons:true,
            mode:'popup',
            source: [],
            update: this.permissions.update,
            visible: this.permissions.visible,
            key: 'helpers',
            title: 'Ayudantes',
            placeholder: 'Ayudantes',
        };

        this.rules['route'] = this._route.ruleObject;
        this.rules['route'].required = true;

        this.rules['dateCreated']={
            'type': 'date',
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'dateCreated',
            'format':'DD-MM-YYYY, LT',
            'icon':'fa fa-calendar',
            'title': 'Creación',
            'placeholder': 'Creación',
        };

        this.rules['usernameCreator']={
            'type': 'text',
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'usernameCreator',
            'icon':'fa fa-user',
            'title': 'Creador',
            'placeholder': 'Creador',
        };

        this.rules = Object.assign({},this.rules,this.getRulesDefault());
        this.rules['enabled'].search = this.permissions.filter;
    }
    initPermissions() {}
    initParamsSearch() {
        this.paramsSearch.title="Buscar planificación";
        this.paramsSearch.placeholder="Ingrese una planificación";
    }
    initParamsSave() {
        this.paramsSave.title="Agregar planificación"
    }
    initRuleObject() {
        this.ruleObject.title="Planificación";
        this.ruleObject.placeholder="Ingrese la planificación";
        this.ruleObject.key="planning";
        this.ruleObject.keyDisplay="planningTitle";
        this.ruleObject.code="planningId";
    }
    initRulesSave() {
        this.rulesSave = Object.assign({},this.rules);
        delete this.rulesSave.enabled;
        delete this.rulesSave.dateCreated;
        delete this.rulesSave.usernameCreator;
        // delete this.rulesSave.helpers;
    }
    initHelpers(){
        let data:any={};
        this.myglobal.max = 1000;
        this.myglobal.onloadData('/search/drivers/',data).then(
            response=>{
                data.list.forEach(val=>{
                    this.rules['helpers'].source.push({
                        'id': val.id,
                        'value': val.id,
                        'text': (val.detail)+(val.title?(' ('+val.title+')'):'')
                    });
                });
                this.completed = true;
            }
        )
    }
}
