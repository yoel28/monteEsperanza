import {ModelBase} from "../../../common/modelBase";
import {globalService} from "../../../common/globalService";

declare var moment:any;

export class ScheduleModel extends ModelBase{
    public rules={};

    constructor(public myglobal:globalService){
        super('SCHEDULE','/schedules/',myglobal);
        this.initModel();
    }

    modelExternal() {}

    initRules() {

        this.rules['code'] = {
            'type': 'text',
            'required': true,
            'update': this.permissions.update,
            'search': this.permissions.filter,
            'visible': this.permissions.visible,
            'key': 'code',
            'title': 'Codigo',
            'placeholder': 'Ingrese codigo',
        };
        this.rules['title'] = {
            'type': 'text',
            'required': true,
            'update': this.permissions.update,
            'search': this.permissions.filter,
            'visible': this.permissions.visible,
            'key': 'title',
            'title': 'Titulo',
            'placeholder': 'Ingrese titulo',
        };


        this.rules['startTime'] = {
            'type': 'datetime',
            'formatView':'HH:mm',
            'formatInput':(data?:number):string=>{
                if(data!=null && data <100)
                    return 'mm';
                return 'hmm';
            },
            'formatOut':(data:any):number=>{
                return +moment(data).format('HHmm');
            },
            'required': true,
            'update': this.permissions.update,
            'search': this.permissions.filter,
            'visible': this.permissions.visible,
            'key': 'startTime',
            'title': 'Inicio',
            'placeholder': 'Inicio',
        };


        this.rules['endTime'] = {
            'type': 'datetime',
            'formatView':'HH:mm',
            'formatInput':(data?:number):string=>{
                if(data!=null && data <100)
                    return 'mm';
                return 'hmm';
            },
            'formatOut':(data:any):number=>{
                return +moment(data).format('HHmm');
            },
            'required': true,
            'update': this.permissions.update,
            'search': this.permissions.filter,
            'visible': this.permissions.visible,
            'key': 'endTime',
            'title': 'Fin',
            'placeholder': 'Fin',
        };



        // this.rules['duration'] = {
        //     'type': 'number',
        //     'step':'0',
        //     'required': true,
        //     'update': this.permissions.update,
        //     'search': this.permissions.filter,
        //     'visible': this.permissions.visible,
        //     'key': 'duration',
        //     'title': 'Duración (Minutos)',
        //     'placeholder': 'Duración (minutos)',
        // };

        this.rules = Object.assign({},this.rules,this.getRulesDefault())
    }
    initPermissions() {}
    initParamsSearch() {
        this.paramsSearch.title="Buscar horario";
        this.paramsSearch.placeholder="Ingrese horario";
        this.paramsSearch.label.title="Código: ";
        this.paramsSearch.label.detail="Titulo: ";
    }
    initParamsSave() {
        this.paramsSave.title="Agregar horario"
    }
    initRuleObject() {
        this.ruleObject.title="Horario";
        this.ruleObject.placeholder="Ingrese horario";
        this.ruleObject.key="schedule";
        this.ruleObject.keyDisplay="scheduleTitle";
        this.ruleObject.code="scheduleId";
    }
    initRulesSave() {
        this.rulesSave = Object.assign({},this.rules);
        delete this.rulesSave.enabled;
    }

}