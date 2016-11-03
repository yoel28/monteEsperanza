import {Http} from "@angular/http";
import { Router }           from '@angular/router-deprecated';
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {globalService} from "../common/globalService";
import {TranslateService} from "ng2-translate/ng2-translate";
import {RestController} from "./restController";

declare var humanizeDuration:any;
declare var moment:any;
export abstract class ControllerBase extends RestController {
    public formatDateId:any = {}
    public permissions:any = {};
    public prefix = "DEFAULT";
    public configId = moment().valueOf();
    public viewOptions:any = {};
    public paramsFilter:any = {};
    public rules:any = {};
    public paramsSearch:any = {};
    public paramsSave:any = {};
    public rulesSave:any = {};
    public ruleObject:any = {};
    public rulesAudict:any = {};
    public dateHmanizer = humanizeDuration.humanizer({
        language: 'shortEs',
        round: true,
        languages: {
            shortEs: {
                y: function () {
                    return 'y'
                },
                mo: function () {
                    return 'm'
                },
                w: function () {
                    return 'Sem'
                },
                d: function () {
                    return 'd'
                },
                h: function () {
                    return 'hr'
                },
                m: function () {
                    return 'min'
                },
                s: function () {
                    return 'seg'
                },
                ms: function () {
                    return 'ms'
                },
            }
        }
    })
    constructor(prefix, endpoint,public router: Router, public http:Http, public toastr:ToastsManager, public myglobal:globalService, public translate:TranslateService) {
        super(http, toastr);
        this.setEndpoint(endpoint);
        //Carga Configuracion por defecto
        this._initRules();
        this._initRulesAudit();
        this._initViewOptions();
        this._initParamsSave();
        this._initParamsSearch();
        this._initParamsFilter();
        this._initRuleObject();
        this._initParamsSearch();
        this.initLang();
    }
    public initLang() {
        var userLang = navigator.language.split('-')[0]; // use navigator lang if available
        userLang = /(es|en)/gi.test(userLang) ? userLang : 'es';
        this.translate.setDefaultLang('en');
        this.translate.use(userLang);
    }
    public initModel() {
        this.initRules();
        this.initRulesAudit();
        this.initViewOptions();
        this.initRulesSave();
        this.initParamsSave();
        this.initParamsSearch();
        this.initParamsFilter();
        this.initRuleObject();
    };
    
    abstract initRules();
    private _initRules() {
        this.rules["detail"] = {
            "update": this.permissions.update,
            "visible": this.permissions.visible,
            "search": this.permissions.filter,
            "showbuttons": true,
            'icon': 'fa fa-list',
            "type": "textarea",
            "key": "detail",
            "title": "detalle",
            "placeholder": "ingrese el detalle",
            'msg': {
                'errors': {},
            }
        };
        this.rules["enabled"] = {
            "update": (this.permissions.update && this.permissions.lock),
            "visible": this.permissions.lock && this.permissions.visible,
            "search": false,
            'required': true,
            'icon': 'fa fa-list',
            "type": "boolean",
            'states': ["Habilitado", "Deshabilitado"],
            "key": "enabled",
            "title": "Habilitado",
            "placeholder": "",
            'msg': {
                'errors': {
                    'required': 'El campo es obligatorio',
                },
            }
        };
    }
    abstract initRulesAudit();
    private _initRulesAudit() {
        if (this.permissions.audit) {
            this.rulesAudict["id"] = {
                'icon': 'fa fa-list',
                "search": this.permissions.filter,
                "type": "number",
                "key": "id",
                "title": "Identificador",
                "placeholder": "Ingrese el identificador",
            };
            this.rulesAudict["dateCreated"] = {
                'icon': 'fa fa-list',
                "search": this.permissions.filter,
                "type": "text",
                "key": "dateCreated",
                "title": "Fecha de creacion",
                "placeholder": "Ingrese la fecha de creación",
            };
            this.rulesAudict["dateUpdated"] = {
                'icon': 'fa fa-list',
                "search": this.permissions.filter,
                "type": "text",
                "key": "dateUpdated",
                "title": "Fecha de actualización",
                "placeholder": "Ingrese la fecha de actualización",
            };
            this.rulesAudict["ip"] = {
                'icon': 'fa fa-list',
                "search": this.permissions.filter,
                "type": "text",
                "key": "ip",
                "title": "Ip",
                "placeholder": "Ingrese la ip",
            };
            this.rulesAudict["userAgent"] = {
                'icon': 'fa fa-list',
                "search": this.permissions.filter,
                "type": "text",
                "key": "userAgent",
                "title": "userAgent",
                "placeholder": "ingrese el userAgent",
            };
            this.rulesAudict["usernameCreator"] = {
                'icon': 'fa fa-list',
                "search": this.permissions.filter,
                "type": "text",
                "key": "usernameCreator",
                "title": "Creador",
                "placeholder": "Ingrese el usuario creador",
            };
            this.rulesAudict["usernameUpdater"] = {
                'icon': 'fa fa-list',
                "search": this.permissions.filter,
                "type": "text",
                "key": "usernameUpdater",
                "title": "Usuario ultima actualización",
                "placeholder": "ingrese el usuario que actualizo",
            };
        }
    }
    abstract initViewOptions();
    private _initViewOptions() {
        this.viewOptions["title"] = 'Default title';
        this.viewOptions["buttons"] = [];
        this.viewOptions["actions"] = {};
        this.viewOptions["errors"] = {};
        this.viewOptions["errors"].title = "ADVERTENCIA";
        this.viewOptions["errors"].notFound = "no se encontraron resultados";
        this.viewOptions["errors"].list = "no tiene permisos para ver esta pagina";
    }
    abstract initRulesSave();
    abstract initParamsSave();
    private _initParamsSave() {
        this.paramsSave = {
            title: "Agregar Default",
            idModal: this.prefix + '_' + this.configId + '_add',
            endpoint: this.endpoint,
        }
    }
    abstract initParamsSearch();
    private _initParamsSearch() {
        this.paramsSearch = {
            'title': this.viewOptions["title"],
            'idModal': this.prefix + '_' + this.configId + '_search',
            'endpoint': "/search" + this.endpoint,
            'placeholder': "Placeholder default",
            'label': {'title': "titulo: ", 'detail': "detalle: "},
            'msg': {
                'errors': {
                    'noAuthorized': 'No posee permisos para esta accion',
                },
            },
            'where': '',
            'imageGuest': '/assets/img/truck-guest.png'
        };
    }
    abstract initParamsFilter();
    private _initParamsFilter() {
        this.paramsFilter = {
            title: "Filter default",
            idModal: this.prefix + '_' + this.configId + '_filter',
            endpoint: "",
        };
    }
    abstract initRuleObject();
    private _initRuleObject() {
        this.ruleObject = {
            'icon': 'fa fa-list',
            "type": "text",
            "key": "keyDefault",
            "title": "TipoDefault",
            'object': true,
            "placeholder": "PlaceHolder default",
            'paramsSearch': this.paramsSearch,
            "permissions": this.permissions,
            'msg': {
                'errors': {
                    'object': 'la referencia no esta registrada',
                    'required': 'El campo es obligatorio'
                },
            }
        }
    }
    public getViewOptionsButtons() {
        let visible = [];
        this.viewOptions['buttons'].forEach(obj=> {
            if (obj.visible)
                visible.push(obj);
        })
        return visible;
    }
    public getViewOptionsActions() {
        let visible = [];
        Object.keys(this.viewOptions.actions).forEach(obj=> {
            if (this.viewOptions.actions[obj].visible)
                visible.push(obj);
        })
        return visible;
    }
    public getObjectKeys(data) {
        return Object.keys(data || {});
    }
    public formatDate(date, format, force = false, id = null) {
        if (date) {
            if (id && this.formatDateId[id])
                force = this.formatDateId[id].value;
            if (this.myglobal.getParams(this.prefix + '_DATE_FORMAT_HUMAN') == 'true' && !force) {
                var diff = moment().valueOf() - moment(date).valueOf();
                if (diff < parseFloat(this.myglobal.getParams('DATE_MAX_HUMAN'))) {
                    if (diff < 1800000)//menor a 30min
                        return 'Hace ' + this.dateHmanizer(diff, {units: ['m', 's']})
                    if (diff < 3600000) //menor a 1hora
                        return 'Hace ' + this.dateHmanizer(diff, {units: ['m']})
                    return 'Hace ' + this.dateHmanizer(diff, {units: ['h', 'm']})
                }
            }
            return moment(date).format(format);
        }
        return "-";
    }
    public changeFormatDate(id) {
        if (!this.formatDateId[id])
            this.formatDateId[id] = {'value': false};
        this.formatDateId[id].value = !this.formatDateId[id].value;
    }
    public viewChangeDate(date) {
        //<i *ngIf="viewChangeDate(data.rechargeReferenceDate)" class="fa fa-exchange" (click)="changeFormatDate(data.id)"></i>
        var diff = moment().valueOf() - moment(date).valueOf();
        return ((diff < parseFloat(this.myglobal.getParams('DATE_MAX_HUMAN'))) && this.myglobal.getParams(this.prefix + '_DATE_FORMAT_HUMAN') == 'true')
    }
    //enlace a restcontroller
    public setLoadData(data) {
        this.dataList.list.unshift(data);
        if (this.dataList.count >= this.max)
            this.dataList.list.pop();
    }
    public loadWhere(where) {
        this.where = where;
        if (this.permissions.list && this.permissions.filter) {
            this.loadData();
        }
    }

    public modalIn:boolean=true;
    public loadPage(accept=false){
        if (!this.permissions.warning || accept) {
            this.modalIn=false;
            this.loadData();
        }
    }
    public onDashboard(){
        let link = ['Dashboard', {}];
        this.router.navigate(link);
    }
}