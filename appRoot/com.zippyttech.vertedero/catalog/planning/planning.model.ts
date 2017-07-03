import {ModelBase} from "../../../common/modelBase";
import {MVehicle} from "../../../vehiculo/MVehicle";
import {MDrivers} from "../../../drivers/MDrivers";
import {MRuta} from "../../../ruta/MRuta";
import {globalService} from "../../../common/globalService";
import {Save} from "../../../utils/save/save";
import {BaseView} from "../../../utils/baseView/baseView";
import {ScheduleModel} from "../schedule/schedule.model";

declare var moment:any;
export class PlanningModel extends ModelBase{

    private _vehicle:MVehicle;
    private _chofer:MDrivers;
    private _ayudante:MDrivers;
    private _route:MRuta;
    private _schedule:ScheduleModel;

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
        this._schedule = new ScheduleModel(this.myglobal);
    }
    initRules(){

        this.rules['dateCreated']={
            'type': 'date',
            'search':this.permissions.filter,
            'visible':false,
            'key': 'dateCreated',
            'format':'DD-MM-YYYY, LT',
            'icon':'fa fa-calendar',
            'title': 'Creación',
            'placeholder': 'Creación',
        };

        this.rules['vehicle'] = this._vehicle.ruleObject;
        this.rules['vehicle'].required = true;
        this.rules['vehicle'].callBack= (save:Save,value:string)=>{
            let data  = save.searchId['vehicle']?save.searchId['vehicle'].data:null;
            if(data && !data.available){
                this.myglobal.toastr.warning('Posee una planificacion cargada que sera desactivada','Advertencia: vehiculo '+data.detail);
            }
        };

        this.rules['route'] = this._route.ruleObject;
        this.rules['route'].required = true;
        this.rules['route'].callBack= (s:Save,value:string)=>{
            if(this.rules['places'].instance)
            {
                this.rules['places'].instance.removeAll();
            }
        };


        this.rules['driver'] = this._chofer.ruleObject;
        this.rules['driver'].required = true;
        this.rules['driver'].key = 'driver';
        this.rules['driver'].code = 'driverId';
        this.rules['driver'].keyDisplay = 'driverName';

        this.rules['scheduleDate']={
            'type': 'date',
            'required':true,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'scheduleDate',
            'format':{
                format: "dd/mm/yyyy",
                formatInput: "YYYYMMDD",
                formatView: "DD/MM/YYYY",
                todayBtn: "linked",
                language: "es",
                forceParse: false,
                autoclose: true,
                todayHighlight: true,
                return: 'YYYYMMDD',
                type:'number'
            },
            'whereparse':(data:any):Object=>{
                if(data.or){
                    data.or[0].value = +moment(data.or[0].value, 'DD-MM-YYYY').format(this.rules['scheduleDate'].format.return);
                    data.or[0].type = 'integer';

                    data.or[1].value = +moment(data.or[1].value, 'DD-MM-YYYY').format(this.rules['scheduleDate'].format.return);
                    data.or[1].type = 'integer';
                }else {
                    data.value = +moment(data.value, 'DD-MM-YYYY').format(this.rules['scheduleDate'].format.return);
                    data.type = 'integer';
                }
                return data;
            },
            'icon':'fa fa-calendar',
            'title': 'Fecha',
            'placeholder': 'Fecha',
        };

        this.rules['helpers'] = {
            type: 'select2',
            showbuttons:true,
            mode:'popup',
            source: [],
            instance:null,
            update: this.permissions.update,
            visible: this.permissions.visible,
            key: 'helpers',
            title: 'Ayudantes',
            placeholder: 'Ayudantes',
        };

        this.mergeRules();

        this.rules['usernameCreator']={
            'type': 'text',
            'search':this.permissions.filter,
            'visible':false,
            'key': 'usernameCreator',
            'icon':'fa fa-user',
            'title': 'Creador',
            'placeholder': 'Creador',
        };

        this.rules['places'] = {
            'type': 'list',
            'subtype':'inlist',
            'disabled':(f:Save)=>{
                if(f.isValid('route') && f.searchId['route']){
                    this.rules['places'].source = f.searchId['route'].data.placesPosible || f.searchId['route'].data.places;
                    this.rules['places'].help = this.rules['places'].source.map(({text})=>text).join('\n');

                };
                return !f.isValid('route');
            },
            'help':'',
            'mode':'popup',
            'showbuttons':true,
            'onlyId':true,
            'list':'placesPosible',
            'maxLength': '35',
            'prefix':'TAG',
            'value':[],
            'source':[],
            'update': this.permissions.update,
            'search': this.permissions.filter && false,
            'visible': this.permissions.visible,
            'key': 'places',
            'title': 'Lugares',
            'placeholder': 'Lugares',
            'instance':null
        };

        this.rules['schedule'] = this._schedule.ruleObject;
        this.rules['schedule'].required = true;

        this.rules['enabled'].search = this.permissions.filter;
        this.rules['detail'].title = "Observación";
        this.rules['detail'].placeholder = "Ingrese una observación";


        //detall observacion.
        //userCreator
        //duplicar
    }
    initPermissions() {}
    initParamsSearch() {
        this.paramsSearch.title="Buscar planificación";
        this.paramsSearch.placeholder="Ingrese una planificación";
    }
    initParamsSave() {
        this.paramsSave.title="Agregar planificación";
        this.paramsSave.afterSave = (bv:BaseView,data:any)=>{
            bv.dataList.list.forEach((obj,i)=>{
                let plate = obj.vehiclePlate == data.vehiclePlate;
                let schedule = obj.scheduleId == data.scheduleId;
                let date = obj.scheduleDate == data.scheduleDate;

                let id = obj.id != data.id;
                if(plate && id && schedule && date){
                    bv.dataList.list.splice(i,1);
                }
            })
        };
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
