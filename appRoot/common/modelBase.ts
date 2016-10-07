import {globalService} from "./globalService";

export abstract class ModelBase{

    public prefix = "DEFAULT";
    public permissions:any = {};
    private rulesDefault:any = {};

    constructor(prefix,public myglobal:globalService){
        this.prefix = prefix;
        this._initModel();
    }

    private _initModel(){
        this._initPermissions(this.prefix);
        this._initRules();
    }
    public initModel(){
        this.initPermissions();
        this.initRules();
    }
    
    
    abstract initPermissions();
    private _initPermissions(prefix) {
        this.permissions['list'] = this.myglobal.existsPermission(this.prefix + '_LIST');
        this.permissions['add'] = this.myglobal.existsPermission(this.prefix + '_ADD');
        this.permissions['update'] = this.myglobal.existsPermission(this.prefix + '_UPDATE');
        this.permissions['delete'] = this.myglobal.existsPermission(this.prefix + '_DELETE');
        this.permissions['filter'] = this.myglobal.existsPermission(this.prefix + '_FILTER');
        this.permissions['lock'] = this.myglobal.existsPermission(this.prefix + '_LOCK');
        this.permissions['visible'] = true;//this.myglobal.existsPermission(this.prefix + '_VISIBLE');
        this.permissions['audit'] = this.myglobal.existsPermission(this.prefix + '_AUDICT');
    }

    abstract initRules();
    private _initRules() {
        this.rulesDefault["detail"] = {
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
        this.rulesDefault["enabled"] = {
            "update": (this.permissions.update && this.permissions.lock),
            "visible": this.permissions.lock && this.permissions.visible,
            "search": this.permissions.filter,
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


    getRulesDefault(){
        return this.rulesDefault;
    }
}