import {Component, OnInit,AfterViewInit} from '@angular/core';
import {BaseView} from "../../../utils/baseView/baseView";
import {globalService} from "../../../common/globalService";
import {MTag} from "../../../tagRfid/MTag";
import {ContainerModel} from "./container.model";

declare var SystemJS:any;
@Component({
    selector: 'container',
    templateUrl:SystemJS.map.app+'/utils/baseView/base.html',
    styleUrls: [SystemJS.map.app+'/utils/baseView/style.css'],
    directives: [BaseView],
})
export class ContainerComponent implements OnInit,AfterViewInit{

    public instance:any={};
    public paramsTable:any={};
    public model:any;
    public viewOptions:any={};
    public tag;

    constructor(public myglobal:globalService) {}

    ngOnInit(){
        this.initModel();
        this.initViewOptions();
        this.loadParamsTable();
    }
    
    ngAfterViewInit():any {
        this.instance = {
            'model':this.model,
            'viewOptions':this.viewOptions,
            'paramsTable':this.paramsTable
        };
    }
    
    initModel() {
        
        this.model= new ContainerModel(this.myglobal);
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
        this.viewOptions["title"] = 'Contenedor';
    }
    
    loadParamsTable(){
        this.paramsTable.actions={};
        this.paramsTable.actions.delete = {
            'message': '¿ Esta seguro de eliminar el contenedor : ',
            'keyAction':'code'
        };
    }
}