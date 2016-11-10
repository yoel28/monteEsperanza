import {Component, OnInit} from '@angular/core';
import {Router}           from '@angular/router-deprecated';
import {Http} from '@angular/http';
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {globalService} from "../common/globalService";
import { ControllerBase} from "../common/ControllerBase";
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";
import {Filter} from "../utils/filter/filter";
import {Tables} from "../utils/tables/tables";
import {Save} from "../utils/save/save";
import {MContainer} from "./MContainer";
import {MTag} from "../tagRfid/MTag";

declare var SystemJS:any;

@Component({
    selector: 'container',
    templateUrl: SystemJS.map.app+'/container/index.html',
    styleUrls: [SystemJS.map.app+'/container/style.css'],
    providers: [TranslateService],
    directives: [Filter,Tables,Save],
    pipes: [TranslatePipe]
})
export class Container extends ControllerBase implements OnInit {

    public dataSelect:any = {};
    public paramsTable:any={};

    public tag;

    constructor(public router:Router, public http:Http, public toastr:ToastsManager, public myglobal:globalService, public translate:TranslateService) {
        super('CONTAINER', '/containers/',router, http, toastr, myglobal, translate);

    }
    ngOnInit(){
        this.initModel();
        this.initViewOptions();
        this.loadParamsTable();
        this.loadPage();
    }
    initModel() {
        this.model= new MContainer(this.myglobal);
        this.tag = new MTag(this.myglobal);

        this.model.rules = Object.assign({},{'tag':{}},this.model.rules);

        this.model.rules['tag'] = this.tag.ruleObject;
        this.model.rules['tag'].required = false;
        this.model.rules['tag'].reference = true;
        this.model.rules['tag'].unique = true;
        this.model.rules['tag'].model = this.tag;
        this.model.rules['tag'].model.paramsSearch.where="&where="+encodeURI("[['op':'isNull','field':'vehicle.id'],['op':'isNull','field':'container.id']]");



        this.model.rules['tag'].callback = (value,dataSelect)=>{
            dataSelect.tagNumber = null;
            dataSelect.tagId = null;

            if(value.containerCode == dataSelect.code){
                dataSelect.tagNumber = value.number;
                dataSelect.tagId = value.id;
            }
        }


    }
    initViewOptions() {
        this.max=10;
        this.viewOptions["title"] = 'Contenedor';
        this.viewOptions["buttons"] = [];
        this.viewOptions["buttons"].push({
            'visible': this.model.permissions.add,
            'title': 'Agregar',
            'class': 'btn btn-green',
            'icon': 'fa fa-save',
            'modal': this.model.paramsSave.idModal
        });

        this.viewOptions["buttons"].push({
            'visible': this.model.permissions.filter,
            'title': 'Filtrar',
            'class': 'btn btn-blue',
            'icon': 'fa fa-filter',
            'modal': this.model.paramsSearch.idModal
        });
    }
    
    loadParamsTable(){
        this.paramsTable.endpoint=this.endpoint;
        this.paramsTable.actions={};
        this.paramsTable.actions.delete = {
            "icon": "fa fa-trash",
            'title': 'Eliminar',
            'idModal': this.prefix+'_'+this.configId+'_del',
            'permission': this.model.permissions.delete,
            'message': '¿ Esta seguro de eliminar el container : ',
            'keyAction':'code'
        };
    }


}

