import {Http} from "@angular/http";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {globalService} from "../common/globalService";
import {TranslateService} from "ng2-translate/ng2-translate";
import {RestController} from "./restController";

export abstract class ModelBase extends RestController {

    public permissions:any = {};
    public prefix = "";

    public viewOptions:any = {};
    public paramsFilter:any = {};
    public rules:any = {};
    public paramsSearch:any = {};
    public paramsSave:any = {};
    public rulesSave:any = {};
    public ruleObject:any = {};
    public rulesAudict:any = {};


    constructor(prefix, endpoint, public http:Http, public toastr:ToastsManager, public myglobal:globalService, public translate:TranslateService) {
        super(http, toastr);

        this.setEndpoint(endpoint);
        this.initConfigurationPermissions(prefix);
        this.initConfigurationAudit();
        this.initConfigurationRules();
        this.initConfigurationViewOption();
        this.initConfigurationSearch();
        this.initConfigurationSave();
        this.initConfigurationRuleObject();
        this.initConfigurationFilter();
        this.initLang();

    }


    abstract initOptions();
    abstract initRules();
    abstract initSearch();
    abstract initRuleObject();
    abstract initFilter();
    abstract initPermissions();


    private initConfigurationRules() {

        this.rules["detail"] = {
            "update": this.permissions['update'],
            "visible": true,
            'icon': 'fa fa-list',
            "search": true,
            "type": "textarea",
            "key": "detail",
            "title": "detalle",
            "placeholder": "ingrese el detalle",
            'msg': {
                'errors': {},
            }
        };
        this.rules["enabled"] = {
            "update": (this.permissions['update'] && this.permissions['lock']),
            "visible": this.permissions['lock'],
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

    private initConfigurationAudit(){
        if(this.permissions.audit){
            this.rulesAudict["id"] = {
                'icon': 'fa fa-list',
                "search": true,
                "type": "number",
                "key": "id",
                "title": "Identificador",
                "placeholder": "Ingrese el identificador",
            };
            this.rulesAudict["dateCreated"] = {
                'icon': 'fa fa-list',
                "search": true,
                "type": "text",
                "key": "dateCreated",
                "title": "Fecha de creacion",
                "placeholder": "Ingrese la fecha de creación",
            };
            this.rulesAudict["dateUpdated"] = {
                'icon': 'fa fa-list',
                "search": true,
                "type": "text",
                "key": "dateUpdated",
                "title": "Fecha de actualización",
                "placeholder": "Ingrese la fecha de actualización",
            };
            this.rulesAudict["ip"] = {
                'icon': 'fa fa-list',
                "search": true,
                "type": "text",
                "key": "ip",
                "title": "Ip",
                "placeholder": "Ingrese la ip",
            };
            this.rulesAudict["userAgent"] = {
                'icon': 'fa fa-list',
                "search": true,
                "type": "text",
                "key": "userAgent",
                "title": "userAgent",
                "placeholder": "ingrese el userAgent",
            };
            this.rulesAudict["usernameCreator"] = {
                'icon': 'fa fa-list',
                "search": true,
                "type": "text",
                "key": "usernameCreator",
                "title": "Creador",
                "placeholder": "Ingrese el usuario creador",
            };
            this.rulesAudict["usernameUpdater"] = {
                'icon': 'fa fa-list',
                "search": true,
                "type": "text",
                "key": "usernameUpdater",
                "title": "Usuario ultima actualización",
                "placeholder": "ingrese el usuario que actualizo",
            };
        }
    }

    private initConfigurationViewOption() {
        this.viewOptions["title"] = 'Default title';
        this.viewOptions["buttons"] = [];
        this.viewOptions["actions"] = {};
        this.viewOptions["errors"] = {};
        this.viewOptions["errors"].title = "ADVERTENCIA";
        this.viewOptions["errors"].notFound = "no se encontraron resultados";
        this.viewOptions["errors"].list = "no tiene permisos para ver esta pagina";
    }

    private initConfigurationPermissions(prefix) {
        this.prefix = prefix;
        this.permissions['list'] = this.myglobal.existsPermission(this.prefix + '_LIST');
        this.permissions['add'] = this.myglobal.existsPermission(this.prefix + '_ADD');
        this.permissions['update'] = this.myglobal.existsPermission(this.prefix + '_UPDATE');
        this.permissions['delete'] = this.myglobal.existsPermission(this.prefix + '_DELETE');
        this.permissions['filter'] = this.myglobal.existsPermission(this.prefix + '_FILTER');
        this.permissions['lock'] = this.myglobal.existsPermission(this.prefix + '_LOCK');
        this.permissions['audit'] = this.myglobal.existsPermission(this.prefix + '_AUDICT');
    }

    private initConfigurationSearch() {

        this.paramsSearch = {

            'title': this.viewOptions["title"],
            'idModal': "searchDefault",
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

    private initConfigurationSave() {

        this.paramsSave = {
            title: "Agregar Default",
            idModal: "saveDefault",
            endpoint: this.endpoint,
        }

    }

    private initConfigurationFilter(){
        this.paramsFilter = {
            title: "Filter default",
            idModal: "modalFilter",
            endpointForm: "",
        };
    }

    private initConfigurationRuleObject() {
        this.ruleObject = {
            'icon': 'fa fa-list',
            "type": "text",
            "key": "keyDefault",
            "title": "TipoDefault",
            'object': true,
            "placeholder": "PlaceHolder default",
            'paramsSearch': this.paramsSearch,
            'msg': {
                'errors': {
                    'object': 'la referencia no esta registrada',
                    'required': 'El campo es obligatorio'
                },
            }
        }
    }


    initLang() {
        var userLang = navigator.language.split('-')[0]; // use navigator lang if available
        userLang = /(es|en)/gi.test(userLang) ? userLang : 'es';
        this.translate.setDefaultLang('en');
        this.translate.use(userLang);
    }

    getViewOptionsButtons(){
        let visible=[];
        this.viewOptions['buttons'].forEach(obj=>{
            if(obj.visible)
                visible.push(obj);
        })
        return visible;
    }

    getViewOptionsActions(){
        let visible=[];
        Object.keys(this.viewOptions.actions).forEach(obj=>{
            if(this.viewOptions.actions[obj].visible)
                visible.push(obj);
        })
        return visible;
    }

    loadWhere(where) {
        this.where = where;
        if (this.permissions.list && this.permissions.filter) {
            this.loadData();
        }
    }

    getObjectKeys(data){
        return Object.keys(data);
    }

    public initModel(){
        this.initPermissions();
        this.initOptions();
        this.initRules();
        this.initFilter();
        this.initSearch();
        this.initRuleObject();
    };


}