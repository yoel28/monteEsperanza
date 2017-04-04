import {Component, EventEmitter, OnInit,ViewChild} from "@angular/core";
import {FormBuilder, ControlGroup} from "@angular/common";
import {RestController} from "../../common/restController";
import {Http} from "@angular/http";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {globalService} from "../../common/globalService";
import {Xeditable, ColorPicker} from "../../common/xeditable";
import {Search} from "../search/search";
import {Save} from "../save/save";
import {Tooltip} from "../tooltips/tooltips";
import {CatalogApp} from "../../common/catalogApp";
import {MapaComponents} from "../../mapa/mapa";

declare var SystemJS:any;
declare var moment:any;
@Component({
    selector: 'tables',
    templateUrl: SystemJS.map.app+'/utils/tables/index.html',
    styleUrls: [SystemJS.map.app+'/utils/tables/style.css'],
    inputs:['params','model','dataList','where'],
    outputs:['getInstance'],
    directives:[Xeditable,ColorPicker,Search,Save,Tooltip,MapaComponents
    ]
})


export class Tables extends RestController implements OnInit {


    public params:any={};
    public model:any={};
    public searchId:any={};
    data:any = [];
    public keys:any = [];
    form:ControlGroup;
    public dataDelete:any={};
    public dataSelect:any={};

    public modelReference :any={};//cargar data a referencias en otros metodos

    public keyActions =[];
    public configId=moment().valueOf();

    public getInstance:any;
    public msg=CatalogApp.msg;

    constructor(public _formBuilder: FormBuilder,public http:Http,public toastr: ToastsManager, public myglobal:globalService) {
        super(http,toastr);
    }

    ngOnInit()
    {
        this.keyActions=Object.keys(this.params.actions);
        this.getInstance = new EventEmitter();
        this.setEndpoint(this.params.endpoint);
        this.getListObjectNotReferenceSave();
    }
    ngAfterViewInit() {
        this.getInstance.emit(this);
    }
    
    keyVisible()
    {
        let data=[];
        let that=this;
        Object.keys(this.model.rules).forEach((key)=>{
            if(that.model.rules[key].visible)
                data.push(key)
        });
        return data;
    }


    public searchTable:any = {};
    public searchTableData:any;

    loadSearchTable(event,key,data)
    {
        event.preventDefault();
        this.searchTable =  Object.assign({},this.model.rules[key].paramsSearch);
        this.searchTable.field =  key;
        this.searchTableData=data;
    }

    public modelSave:any={};
    loadSaveModal(event,key,data)
    {
        event.preventDefault();
        this.dataSelect=data;
    }
    getDataSave(data,key){
        this.onPatch(this.modelSave[key].key,this.dataSelect,data.id);
    }
    getDataSearch(data){
        this.onPatch(this.searchTable.field,this.searchTableData,data.id);
    }
    actionPermissionKey() 
    {
        let data=[];
        let that=this;

        Object.keys(this.params.actions).forEach((key)=>
        {
            if( that.myglobal.existsPermission(that.params.actions[key].permission) )
                data.push(key);
        });

        return data;
    }
    getListObjectNotReferenceSave(){
        let that = this;
        Object.keys(this.model.rules).forEach(key=>{
            if(that.model.rules[key].object && !that.model.rules[key].reference && that.model.rules[key].permissions.add)
                that.modelSave[key]=that.model.rules[key];
        })
    }

    getKeys(data)
    {
        return Object.keys(data);
    }

    getBooleandData(key,data){
        let field = {'class':'btn btn-orange','text':'n/a','disabled':true};

        if( (!eval(this.model.rules[key].disabled || 'false')))
        {
            let index = this.model.rules[key].source.findIndex(obj => (obj.value == data[key] || obj.id == data[key]));
            if(index > -1)
            {
                this.model.rules[key].source[index].disabled=!this.model.rules[key].update;
                return this.model.rules[key].source[index];
            }
        }
        return field;

    }

    getDisabledField(key,data){
        return (eval(this.model.rules[key].disabled || 'false'));
    }

    public loadDataFieldReference(data,key,setNull=false){
        this.modelReference=Object.assign({},this.model.rules[key]);
        this.dataSelect = data;
        if(setNull)
            this.setDataFieldReference(data,true);

    }
    
    public setDataFieldReference(data,setNull=false)
    {
        let value=null;
        let that = this;

        if(!setNull)//no colocar valor nulo
        {
            value=this.dataSelect.id;
            if(that.dataSelect[that.modelReference.code]!=null && that.modelReference.unique)
                that.modelReference.model.setDataField(that.dataSelect[that.modelReference.code],that.model.ruleObject.key,null,that.modelReference.callback,that.dataSelect).then(
                    response=>{
                        that.modelReference.model.setDataField(data.id,that.model.ruleObject.key,value,that.modelReference.callback,that.dataSelect);
                    });
            else
                that.modelReference.model.setDataField(data.id,that.model.ruleObject.key,value,that.modelReference.callback,that.dataSelect);
        }
        else
            that.modelReference.model.setDataField(data[that.modelReference.code],that.model.ruleObject.key,null,that.modelReference.callback,data);

    }
    public coordMap:Object;
    loadMap(event,data){
        this.coordMap={};
        this.coordMap['lat']=data.latitud;
        this.coordMap['lng']=data.longitud;
    }






}
