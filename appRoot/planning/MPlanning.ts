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
        this.initModel();
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

        this.rules['driver'] = this._chofer.ruleObject;
        this.rules['driver'].required = true;
        this.rules['driver'].key = 'driver';
        this.rules['driver'].code = 'driverId';
        this.rules['driver'].keyDisplay = 'driverName';

        this.rules['helpers'] = {
            'type': 'list',
            'showbuttons':true,
            'mode':'popup',
            'save':{
                key:'id',
            },
            'maxLength': '35',
            'prefix':'PLANNING',
            'value':[],
            'update': this.permissions.update,
            'visible': this.permissions.visible,
            'key': 'helpers',
            'instance':null,
            'tagFree':this.permissions.tagFree || true,//TODO
            'title': 'Ayudantes',
            'placeholder': 'Ayudantes',
            callback:(save:Save,value:string='')=>{
                let data:any={};
                this.myglobal.onloadData('/search/drivers/'+value,data).then(
                    response=>{
                        if(data.count == 1 || (data.count && this._paramsAdd)){
                            data.list.forEach(value =>{
                                this.rules['helpers'].instance.addValue(
                                    {
                                        'id': value.id,
                                        'value': value.detail,
                                        'title': value.title
                                    }
                                );
                            });
                            return;
                        }
                        this.myglobal.toastr.info('Se encontro '+data.count+' coincidencia(s)','Informacion');

                    }
                )
            }
        };

        this.rules['route'] = this._route.ruleObject;
        this.rules['route'].required = true;

        this.rules = Object.assign({},this.rules,this.getRulesDefault());
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
    }
}
